#include "CheckpointGate.h"

#include "Components/BoxComponent.h"
#include "Components/PointLightComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Engine/StaticMesh.h"
#include "MidnightRocketRacerGameMode.h"

ACheckpointGate::ACheckpointGate()
{
    Trigger = CreateDefaultSubobject<UBoxComponent>(TEXT("Trigger"));
    SetRootComponent(Trigger);
    Trigger->SetBoxExtent(FVector(160.0f, 1200.0f, 900.0f));
    Trigger->SetCollisionEnabled(ECollisionEnabled::QueryOnly);
    Trigger->SetCollisionResponseToAllChannels(ECR_Ignore);
    Trigger->SetCollisionResponseToChannel(ECC_Pawn, ECR_Overlap);
    Trigger->OnComponentBeginOverlap.AddDynamic(this, &ACheckpointGate::OnGateOverlap);

    const UStaticMesh* Cube = LoadObject<UStaticMesh>(nullptr, TEXT("/Engine/BasicShapes/Cube.Cube"));

    LeftPillar = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("LeftPillar"));
    LeftPillar->SetupAttachment(Trigger);
    LeftPillar->SetStaticMesh(const_cast<UStaticMesh*>(Cube));
    LeftPillar->SetRelativeLocation(FVector(0.0f, -1160.0f, 0.0f));
    LeftPillar->SetRelativeScale3D(FVector(0.18f, 0.18f, 8.0f));
    LeftPillar->SetCollisionEnabled(ECollisionEnabled::NoCollision);

    RightPillar = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("RightPillar"));
    RightPillar->SetupAttachment(Trigger);
    RightPillar->SetStaticMesh(const_cast<UStaticMesh*>(Cube));
    RightPillar->SetRelativeLocation(FVector(0.0f, 1160.0f, 0.0f));
    RightPillar->SetRelativeScale3D(FVector(0.18f, 0.18f, 8.0f));
    RightPillar->SetCollisionEnabled(ECollisionEnabled::NoCollision);

    GateGlow = CreateDefaultSubobject<UPointLightComponent>(TEXT("GateGlow"));
    GateGlow->SetupAttachment(Trigger);
    GateGlow->SetLightColor(FLinearColor(0.0f, 0.55f, 1.0f));
    GateGlow->SetIntensity(30000.0f);
    GateGlow->SetAttenuationRadius(1800.0f);
    GateGlow->SetCastShadows(false);
}

void ACheckpointGate::Configure(int32 InCheckpointIndex, bool bInFinishGate)
{
    CheckpointIndex = InCheckpointIndex;
    bFinishGate = bInFinishGate;
    GateGlow->SetLightColor(bFinishGate ? FLinearColor(1.0f, 0.08f, 0.42f) : FLinearColor(0.0f, 0.55f, 1.0f));
}

void ACheckpointGate::OnGateOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComponent, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
    if (bConsumed || !OtherActor || !OtherActor->IsA<APawn>())
    {
        return;
    }

    if (AMidnightRocketRacerGameMode* GameMode = GetWorld()->GetAuthGameMode<AMidnightRocketRacerGameMode>())
    {
        const int32 RequiredCheckpoint = GameMode->GetNextCheckpoint();
        GameMode->RegisterCheckpoint(CheckpointIndex);
        bConsumed = RequiredCheckpoint == CheckpointIndex;
        if (bConsumed)
        {
            GateGlow->SetIntensity(9000.0f);
        }
    }
}
