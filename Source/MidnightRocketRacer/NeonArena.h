#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "NeonArena.generated.h"

class UStaticMeshComponent;
class UPointLightComponent;
class USpotLightComponent;
class UMaterialInterface;

UCLASS()
class MIDNIGHTROCKETRACER_API ANeonArena : public AActor
{
    GENERATED_BODY()

public:
    ANeonArena();

protected:
    virtual void BeginPlay() override;

private:
    UStaticMeshComponent* AddBlock(const FName Name, const FVector& Location, const FVector& Scale, const FRotator& Rotation, const FLinearColor& Color, bool bTrackSurface = false);
    UPointLightComponent* AddGlow(const FName Name, const FVector& Location, const FLinearColor& Color, float Intensity, float Radius);
    UMaterialInterface* ResolveBasicMaterial() const;

    UPROPERTY()
    TObjectPtr<USceneComponent> SceneRoot;

    UPROPERTY()
    TObjectPtr<UStaticMesh> CubeMesh;

    UPROPERTY()
    TObjectPtr<UStaticMesh> CylinderMesh;

    UPROPERTY()
    TObjectPtr<UMaterialInterface> BasicMaterial;
};
