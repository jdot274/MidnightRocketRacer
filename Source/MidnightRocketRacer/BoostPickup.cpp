#include "BoostPickup.h"

#include "ArcadeRacerPawn.h"
#include "Components/PointLightComponent.h"
#include "Components/SphereComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Engine/StaticMesh.h"

ABoostPickup::ABoostPickup()
{
    PrimaryActorTick.bCanEverTick = true;

    Trigger = CreateDefaultSubobject<USphereComponent>(TEXT("Trigger"));
    SetRootComponent(Trigger);
    Trigger->SetSphereRadius(200.0f);
    Trigger->SetCollisionEnabled(ECollisionEnabled::QueryOnly);
    Trigger->SetCollisionResponseToAllChannels(ECR_Ignore);
    Trigger->SetCollisionResponseToChannel(ECC_Pawn, ECR_Overlap);
    Trigger->OnComponentBeginOverlap.AddDynamic(this, &ABoostPickup::OnPickupOverlap);

    Mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("BoostCore"));
    Mesh->SetupAttachment(Trigger);
    Mesh->SetStaticMesh(LoadObject<UStaticMesh>(nullptr, TEXT("/Engine/BasicShapes/Cylinder.Cylinder")));
    Mesh->SetRelativeScale3D(FVector(0.72f, 0.72f, 1.2f));
    Mesh->SetCollisionEnabled(ECollisionEnabled::NoCollision);

    Glow = CreateDefaultSubobject<UPointLightComponent>(TEXT("Glow"));
    Glow->SetupAttachment(Trigger);
    Glow->SetLightColor(FLinearColor(0.15f, 1.0f, 0.3f));
    Glow->SetIntensity(28000.0f);
    Glow->SetAttenuationRadius(900.0f);
    Glow->SetCastShadows(false);
}

void ABoostPickup::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);
    AddActorLocalRotation(FRotator(0.0f, 90.0f * DeltaSeconds, 0.0f));
    Mesh->SetRelativeLocation(FVector(0.0f, 0.0f, FMath::Sin(GetWorld()->GetTimeSeconds() * 2.5f) * 35.0f));
}

void ABoostPickup::OnPickupOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComponent, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
    if (AArcadeRacerPawn* Racer = Cast<AArcadeRacerPawn>(OtherActor))
    {
        Racer->RefillBoost();
        Destroy();
    }
}
