#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "CheckpointGate.generated.h"

class UBoxComponent;
class UStaticMeshComponent;
class UPointLightComponent;

UCLASS()
class MIDNIGHTROCKETRACER_API ACheckpointGate : public AActor
{
    GENERATED_BODY()

public:
    ACheckpointGate();
    void Configure(int32 InCheckpointIndex, bool bInFinishGate);

private:
    UFUNCTION()
    void OnGateOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComponent, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

    UPROPERTY(VisibleAnywhere)
    TObjectPtr<UBoxComponent> Trigger;

    UPROPERTY(VisibleAnywhere)
    TObjectPtr<UStaticMeshComponent> LeftPillar;

    UPROPERTY(VisibleAnywhere)
    TObjectPtr<UStaticMeshComponent> RightPillar;

    UPROPERTY(VisibleAnywhere)
    TObjectPtr<UPointLightComponent> GateGlow;

    int32 CheckpointIndex = 0;
    bool bFinishGate = false;
    bool bConsumed = false;
};
