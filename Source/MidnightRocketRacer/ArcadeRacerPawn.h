#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Pawn.h"
#include "ArcadeRacerPawn.generated.h"

class UCameraComponent;
class USpringArmComponent;
class UStaticMeshComponent;
class UPointLightComponent;

UCLASS()
class MIDNIGHTROCKETRACER_API AArcadeRacerPawn : public APawn
{
    GENERATED_BODY()

public:
    AArcadeRacerPawn();
    virtual void Tick(float DeltaSeconds) override;
    virtual void SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) override;

    UFUNCTION(BlueprintPure, Category = "Racer")
    float GetSpeedKph() const;

    UFUNCTION(BlueprintPure, Category = "Racer")
    float GetBoostEnergy() const { return BoostEnergy; }

    UFUNCTION(BlueprintCallable, Category = "Racer")
    void RefillBoost(float Amount = 28.0f);

protected:
    virtual void BeginPlay() override;

private:
    void SetThrottle(float Value);
    void SetSteering(float Value);
    void SetCameraYaw(float Value);
    void SetCameraPitch(float Value);
    void SetBoostPressed();
    void SetBoostReleased();
    void SetDriftPressed();
    void SetDriftReleased();
    void ResetVehicle();
    bool IsGrounded() const;
    void ApplyDriveForces(float DeltaSeconds);
    void ApplyStability(float DeltaSeconds);

    UPROPERTY(VisibleAnywhere, Category = "Racer")
    TObjectPtr<UStaticMeshComponent> Chassis;

    UPROPERTY(VisibleAnywhere, Category = "Racer")
    TObjectPtr<USpringArmComponent> CameraBoom;

    UPROPERTY(VisibleAnywhere, Category = "Racer")
    TObjectPtr<UCameraComponent> ChaseCamera;

    UPROPERTY(VisibleAnywhere, Category = "Racer")
    TObjectPtr<UPointLightComponent> BoostGlow;

    UPROPERTY(EditDefaultsOnly, Category = "Racer|Handling")
    float EngineForce = 150000.0f;

    UPROPERTY(EditDefaultsOnly, Category = "Racer|Handling")
    float BoostForce = 290000.0f;

    UPROPERTY(EditDefaultsOnly, Category = "Racer|Handling")
    float TurnTorque = 1250000.0f;

    UPROPERTY(EditDefaultsOnly, Category = "Racer|Handling")
    float GripForce = 250.0f;

    UPROPERTY(EditDefaultsOnly, Category = "Racer|Handling")
    float DriftGripMultiplier = 0.18f;

    UPROPERTY(EditDefaultsOnly, Category = "Racer|Handling")
    float AirControlTorque = 400000.0f;

    UPROPERTY(EditAnywhere, Category = "Racer|State")
    float BoostEnergy = 100.0f;

    FVector SpawnLocation = FVector::ZeroVector;
    FRotator SpawnRotation = FRotator::ZeroRotator;
    float ThrottleInput = 0.0f;
    float SteeringInput = 0.0f;
    bool bBoosting = false;
    bool bDrifting = false;
};
