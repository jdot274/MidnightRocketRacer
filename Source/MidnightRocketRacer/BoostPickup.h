#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BoostPickup.generated.h"

class USphereComponent;
class UStaticMeshComponent;
class UPointLightComponent;

UCLASS()
class MIDNIGHTROCKETRACER_API ABoostPickup : public AActor
{
    GENERATED_BODY()

public:
    ABoostPickup();
    virtual void Tick(float DeltaSeconds) override;

private:
    UFUNCTION()
    void OnPickupOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComponent, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

    UPROPERTY(VisibleAnywhere)
    TObjectPtr<USphereComponent> Trigger;

    UPROPERTY(VisibleAnywhere)
    TObjectPtr<UStaticMeshComponent> Mesh;

    UPROPERTY(VisibleAnywhere)
    TObjectPtr<UPointLightComponent> Glow;
};
