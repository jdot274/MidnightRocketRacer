#include "NeonArena.h"

#include "Components/PointLightComponent.h"
#include "Components/SceneComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Engine/StaticMesh.h"
#include "Materials/MaterialInstanceDynamic.h"
#include "UObject/ConstructorHelpers.h"

ANeonArena::ANeonArena()
{
    PrimaryActorTick.bCanEverTick = false;

    SceneRoot = CreateDefaultSubobject<USceneComponent>(TEXT("ArenaRoot"));
    SetRootComponent(SceneRoot);

    static ConstructorHelpers::FObjectFinder<UStaticMesh> CubeAsset(TEXT("/Engine/BasicShapes/Cube.Cube"));
    static ConstructorHelpers::FObjectFinder<UStaticMesh> CylinderAsset(TEXT("/Engine/BasicShapes/Cylinder.Cylinder"));
    static ConstructorHelpers::FObjectFinder<UMaterialInterface> MaterialAsset(TEXT("/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"));
    CubeMesh = CubeAsset.Object;
    CylinderMesh = CylinderAsset.Object;
    BasicMaterial = MaterialAsset.Object;
}

void ANeonArena::BeginPlay()
{
    Super::BeginPlay();

    const FLinearColor BlackChrome(0.006f, 0.008f, 0.018f);
    const FLinearColor ElectricBlue(0.0f, 0.32f, 1.0f);
    const FLinearColor Magenta(1.0f, 0.0f, 0.42f);
    const FLinearColor AcidLime(0.2f, 1.0f, 0.28f);

    AddBlock(TEXT("ReflectiveFloor"), FVector(0.0f, 0.0f, -105.0f), FVector(115.0f, 68.0f, 0.5f), FRotator::ZeroRotator, BlackChrome, true);
    AddBlock(TEXT("StartPad"), FVector(0.0f, 0.0f, -45.0f), FVector(8.0f, 12.0f, 0.15f), FRotator::ZeroRotator, ElectricBlue, true);

    // Outer speedway and elevated stunt route.
    AddBlock(TEXT("NorthRun"), FVector(5100.0f, 0.0f, 0.0f), FVector(38.0f, 12.0f, 0.45f), FRotator::ZeroRotator, BlackChrome, true);
    AddBlock(TEXT("EastBank"), FVector(9200.0f, 1900.0f, 680.0f), FVector(18.0f, 12.0f, 0.45f), FRotator(0.0f, 0.0f, 21.0f), BlackChrome, true);
    AddBlock(TEXT("SkyRamp"), FVector(11100.0f, 3400.0f, 1680.0f), FVector(24.0f, 12.0f, 0.45f), FRotator(0.0f, -16.0f, 0.0f), BlackChrome, true);
    AddBlock(TEXT("ReturnRun"), FVector(6900.0f, 3400.0f, 1250.0f), FVector(30.0f, 12.0f, 0.45f), FRotator::ZeroRotator, BlackChrome, true);
    AddBlock(TEXT("DropRamp"), FVector(3000.0f, 2700.0f, 500.0f), FVector(22.0f, 12.0f, 0.45f), FRotator(0.0f, 16.0f, 0.0f), BlackChrome, true);

    // Edge rails establish the neon silhouette and protect the first playable route.
    const TArray<FVector> RailStarts = {
        FVector(4500, 1200, 210), FVector(4500, -1200, 210),
        FVector(8500, 1200, 390), FVector(8500, -1200, 390),
        FVector(10500, 2200, 1320), FVector(10500, 4600, 1320),
        FVector(6800, 2200, 1440), FVector(6800, 4600, 1440),
        FVector(2700, 1500, 750), FVector(2700, 3900, 750)
    };

    for (int32 Index = 0; Index < RailStarts.Num(); ++Index)
    {
        const bool bPink = Index % 2 == 0;
        AddBlock(*FString::Printf(TEXT("Rail_%02d"), Index), RailStarts[Index], FVector(25.0f, 0.08f, 0.12f), FRotator::ZeroRotator, bPink ? Magenta : ElectricBlue);
    }

    // Boost gates give the arena an immediate high-speed read even before pickups are connected.
    for (int32 Index = 0; Index < 5; ++Index)
    {
        const float X = 1800.0f + Index * 1700.0f;
        AddBlock(*FString::Printf(TEXT("BoostStrip_%02d"), Index), FVector(X, 0.0f, 15.0f), FVector(4.0f, 5.0f, 0.04f), FRotator::ZeroRotator, AcidLime);
    }

    AddBlock(TEXT("FinishPylonLeft"), FVector(12100.0f, -1050.0f, 760.0f), FVector(0.25f, 0.25f, 8.0f), FRotator::ZeroRotator, Magenta);
    AddBlock(TEXT("FinishPylonRight"), FVector(12100.0f, 1050.0f, 760.0f), FVector(0.25f, 0.25f, 8.0f), FRotator::ZeroRotator, ElectricBlue);
    AddBlock(TEXT("FinishBridge"), FVector(12100.0f, 0.0f, 1500.0f), FVector(0.25f, 11.0f, 0.2f), FRotator::ZeroRotator, AcidLime);

    AddGlow(TEXT("KeyBlue"), FVector(3500.0f, -2400.0f, 2100.0f), ElectricBlue, 120000.0f, 5800.0f);
    AddGlow(TEXT("KeyPink"), FVector(8800.0f, 3600.0f, 3300.0f), Magenta, 150000.0f, 6200.0f);
    AddGlow(TEXT("FinishLime"), FVector(11900.0f, 0.0f, 2200.0f), AcidLime, 80000.0f, 3800.0f);
}

UStaticMeshComponent* ANeonArena::AddBlock(const FName Name, const FVector& Location, const FVector& Scale, const FRotator& Rotation, const FLinearColor& Color, bool bTrackSurface)
{
    UStaticMeshComponent* Block = NewObject<UStaticMeshComponent>(this, Name);
    Block->SetupAttachment(SceneRoot);
    Block->SetStaticMesh(CubeMesh);
    Block->SetRelativeLocation(Location);
    Block->SetRelativeRotation(Rotation);
    Block->SetRelativeScale3D(Scale);
    Block->SetCollisionEnabled(bTrackSurface ? ECollisionEnabled::QueryAndPhysics : ECollisionEnabled::QueryOnly);
    Block->SetCollisionResponseToAllChannels(ECR_Block);
    Block->RegisterComponent();

    if (UMaterialInterface* Material = ResolveBasicMaterial())
    {
        UMaterialInstanceDynamic* DynamicMaterial = UMaterialInstanceDynamic::Create(Material, this);
        DynamicMaterial->SetVectorParameterValue(TEXT("Color"), Color);
        DynamicMaterial->SetVectorParameterValue(TEXT("BaseColor"), Color);
        DynamicMaterial->SetVectorParameterValue(TEXT("EmissiveColor"), Color);
        Block->SetMaterial(0, DynamicMaterial);
    }

    return Block;
}

UPointLightComponent* ANeonArena::AddGlow(const FName Name, const FVector& Location, const FLinearColor& Color, float Intensity, float Radius)
{
    UPointLightComponent* Glow = NewObject<UPointLightComponent>(this, Name);
    Glow->SetupAttachment(SceneRoot);
    Glow->SetRelativeLocation(Location);
    Glow->SetLightColor(Color);
    Glow->SetIntensity(Intensity);
    Glow->SetAttenuationRadius(Radius);
    Glow->SetCastShadows(false);
    Glow->RegisterComponent();
    return Glow;
}

UMaterialInterface* ANeonArena::ResolveBasicMaterial() const
{
    return BasicMaterial;
}
