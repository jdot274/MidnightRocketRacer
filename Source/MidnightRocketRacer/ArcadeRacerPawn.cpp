#include "ArcadeRacerPawn.h"

#include "Camera/CameraComponent.h"
#include "Components/PointLightComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Engine/StaticMesh.h"
#include "GameFramework/SpringArmComponent.h"
#include "Kismet/KismetSystemLibrary.h"

AArcadeRacerPawn::AArcadeRacerPawn()
{
    PrimaryActorTick.bCanEverTick = true;

    Chassis = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Chassis"));
    SetRootComponent(Chassis);
    Chassis->SetStaticMesh(LoadObject<UStaticMesh>(nullptr, TEXT("/Engine/BasicShapes/Cube.Cube")));
    Chassis->SetRelativeScale3D(FVector(2.35f, 1.12f, 0.45f));
    Chassis->SetSimulatePhysics(true);
    Chassis->SetEnableGravity(true);
    Chassis->SetLinearDamping(0.07f);
    Chassis->SetAngularDamping(2.0f);
    Chassis->SetMassOverrideInKg(NAME_None, 1100.0f, true);

    CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraBoom"));
    CameraBoom->SetupAttachment(Chassis);
    CameraBoom->TargetArmLength = 760.0f;
    CameraBoom->SetRelativeLocation(FVector(-35.0f, 0.0f, 140.0f));
    CameraBoom->SetRelativeRotation(FRotator(-12.0f, 0.0f, 0.0f));
    CameraBoom->bUsePawnControlRotation = true;
    CameraBoom->bEnableCameraLag = true;
    CameraBoom->CameraLagSpeed = 8.0f;
    CameraBoom->CameraRotationLagSpeed = 12.0f;

    ChaseCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("ChaseCamera"));
    ChaseCamera->SetupAttachment(CameraBoom, USpringArmComponent::SocketName);
    ChaseCamera->bUsePawnControlRotation = false;
    ChaseCamera->FieldOfView = 92.0f;

    BoostGlow = CreateDefaultSubobject<UPointLightComponent>(TEXT("BoostGlow"));
    BoostGlow->SetupAttachment(Chassis);
    BoostGlow->SetRelativeLocation(FVector(-240.0f, 0.0f, 0.0f));
    BoostGlow->SetLightColor(FLinearColor(0.0f, 0.55f, 1.0f));
    BoostGlow->SetIntensity(1800.0f);
    BoostGlow->SetAttenuationRadius(500.0f);
}

void AArcadeRacerPawn::BeginPlay()
{
    Super::BeginPlay();
    SpawnLocation = GetActorLocation();
    SpawnRotation = GetActorRotation();
}

void AArcadeRacerPawn::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);
    ApplyDriveForces(DeltaSeconds);
    ApplyStability(DeltaSeconds);

    if (GetActorLocation().Z < -2500.0f)
    {
        ResetVehicle();
    }

    const float TargetGlow = bBoosting && BoostEnergy > 0.0f ? 11000.0f : 1800.0f;
    BoostGlow->SetIntensity(FMath::FInterpTo(BoostGlow->Intensity, TargetGlow, DeltaSeconds, 8.0f));
}

void AArcadeRacerPawn::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    check(PlayerInputComponent);
    PlayerInputComponent->BindAxis(TEXT("Throttle"), this, &AArcadeRacerPawn::SetThrottle);
    PlayerInputComponent->BindAxis(TEXT("Steer"), this, &AArcadeRacerPawn::SetSteering);
    PlayerInputComponent->BindAxis(TEXT("Turn"), this, &AArcadeRacerPawn::SetCameraYaw);
    PlayerInputComponent->BindAxis(TEXT("LookUp"), this, &AArcadeRacerPawn::SetCameraPitch);
    PlayerInputComponent->BindAction(TEXT("Boost"), IE_Pressed, this, &AArcadeRacerPawn::SetBoostPressed);
    PlayerInputComponent->BindAction(TEXT("Boost"), IE_Released, this, &AArcadeRacerPawn::SetBoostReleased);
    PlayerInputComponent->BindAction(TEXT("Drift"), IE_Pressed, this, &AArcadeRacerPawn::SetDriftPressed);
    PlayerInputComponent->BindAction(TEXT("Drift"), IE_Released, this, &AArcadeRacerPawn::SetDriftReleased);
    PlayerInputComponent->BindAction(TEXT("Reset"), IE_Pressed, this, &AArcadeRacerPawn::ResetVehicle);
}

float AArcadeRacerPawn::GetSpeedKph() const
{
    return Chassis->GetPhysicsLinearVelocity().Size() * 0.036f;
}

void AArcadeRacerPawn::RefillBoost(float Amount)
{
    BoostEnergy = FMath::Clamp(BoostEnergy + Amount, 0.0f, 100.0f);
}

void AArcadeRacerPawn::SetThrottle(float Value) { ThrottleInput = Value; }
void AArcadeRacerPawn::SetSteering(float Value) { SteeringInput = Value; }
void AArcadeRacerPawn::SetCameraYaw(float Value) { AddControllerYawInput(Value); }
void AArcadeRacerPawn::SetCameraPitch(float Value) { AddControllerPitchInput(Value); }
void AArcadeRacerPawn::SetBoostPressed() { bBoosting = true; }
void AArcadeRacerPawn::SetBoostReleased() { bBoosting = false; }
void AArcadeRacerPawn::SetDriftPressed() { bDrifting = true; }
void AArcadeRacerPawn::SetDriftReleased() { bDrifting = false; }

bool AArcadeRacerPawn::IsGrounded() const
{
    FHitResult Hit;
    const FVector Start = Chassis->GetComponentLocation();
    const FVector End = Start - FVector(0.0f, 0.0f, 155.0f);
    FCollisionQueryParams Params(SCENE_QUERY_STAT(RacerGroundCheck), false, this);
    return GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility, Params);
}

void AArcadeRacerPawn::ApplyDriveForces(float DeltaSeconds)
{
    const FVector Velocity = Chassis->GetPhysicsLinearVelocity();
    const FVector Forward = Chassis->GetForwardVector();
    const bool bOnGround = IsGrounded();

    if (bOnGround)
    {
        Chassis->AddForce(Forward * ThrottleInput * EngineForce);

        if (bBoosting && BoostEnergy > 0.0f)
        {
            Chassis->AddForce(Forward * BoostForce);
            BoostEnergy = FMath::Max(0.0f, BoostEnergy - 28.0f * DeltaSeconds);
        }
        else
        {
            BoostEnergy = FMath::Min(100.0f, BoostEnergy + 8.0f * DeltaSeconds);
        }

        const float SpeedFactor = FMath::Clamp(Velocity.Size() / 1200.0f, 0.15f, 1.0f);
        Chassis->AddTorqueInRadians(FVector(0.0f, 0.0f, SteeringInput * TurnTorque * SpeedFactor));

        const FVector Right = Chassis->GetRightVector();
        const float LateralSpeed = FVector::DotProduct(Velocity, Right);
        const float ActiveGrip = GripForce * (bDrifting ? DriftGripMultiplier : 1.0f);
        Chassis->AddForce(-Right * LateralSpeed * ActiveGrip);
    }
    else
    {
        const FVector Torque = FVector(-SteeringInput * AirControlTorque, 0.0f, -ThrottleInput * AirControlTorque * 0.55f);
        Chassis->AddTorqueInRadians(Torque);
    }
}

void AArcadeRacerPawn::ApplyStability(float DeltaSeconds)
{
    if (!IsGrounded())
    {
        return;
    }

    const FVector Up = Chassis->GetUpVector();
    const FVector CorrectionAxis = FVector::CrossProduct(Up, FVector::UpVector);
    Chassis->AddTorqueInRadians(CorrectionAxis * 280000.0f);
}

void AArcadeRacerPawn::ResetVehicle()
{
    Chassis->SetPhysicsLinearVelocity(FVector::ZeroVector);
    Chassis->SetPhysicsAngularVelocityInRadians(FVector::ZeroVector);
    Chassis->SetWorldLocationAndRotation(SpawnLocation + FVector(0.0f, 0.0f, 140.0f), SpawnRotation, false, nullptr, ETeleportType::TeleportPhysics);
    BoostEnergy = 100.0f;
}
