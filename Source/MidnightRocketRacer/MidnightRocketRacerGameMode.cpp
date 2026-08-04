#include "MidnightRocketRacerGameMode.h"

#include "ArcadeRacerPawn.h"
#include "CheckpointGate.h"
#include "NeonArena.h"
#include "RaceHUD.h"
#include "BoostPickup.h"

AMidnightRocketRacerGameMode::AMidnightRocketRacerGameMode()
{
    PrimaryActorTick.bCanEverTick = true;
    DefaultPawnClass = AArcadeRacerPawn::StaticClass();
    HUDClass = ARaceHUD::StaticClass();
}

void AMidnightRocketRacerGameMode::BeginPlay()
{
    Super::BeginPlay();
    GetWorld()->SpawnActor<ANeonArena>(ANeonArena::StaticClass(), FTransform::Identity);
    SpawnRaceRoute();
}

void AMidnightRocketRacerGameMode::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);

    if (!bRaceStarted && !bRaceFinished)
    {
        Countdown -= DeltaSeconds;
        if (Countdown <= 0.0f)
        {
            Countdown = 0.0f;
            bRaceStarted = true;
        }
    }
    else if (bRaceStarted && !bRaceFinished)
    {
        RaceTime += DeltaSeconds;
    }
}

void AMidnightRocketRacerGameMode::RegisterCheckpoint(int32 CheckpointIndex)
{
    if (!bRaceStarted || bRaceFinished || CheckpointIndex != NextCheckpoint)
    {
        return;
    }

    ++NextCheckpoint;
    if (NextCheckpoint >= 4)
    {
        bRaceFinished = true;
    }
}

void AMidnightRocketRacerGameMode::SpawnRaceRoute()
{
    const TArray<FVector> Gates =
    {
        FVector(4600.0f, 0.0f, 480.0f),
        FVector(9200.0f, 1900.0f, 1160.0f),
        FVector(7000.0f, 3400.0f, 1800.0f),
        FVector(12100.0f, 0.0f, 1700.0f)
    };

    for (int32 Index = 0; Index < Gates.Num(); ++Index)
    {
        ACheckpointGate* Gate = GetWorld()->SpawnActor<ACheckpointGate>(ACheckpointGate::StaticClass(), Gates[Index], FRotator::ZeroRotator);
        Gate->Configure(Index, Index == Gates.Num() - 1);
    }

    const TArray<FVector> Pickups =
    {
        FVector(1900.0f, 0.0f, 85.0f),
        FVector(3600.0f, 0.0f, 85.0f),
        FVector(5600.0f, 0.0f, 85.0f),
        FVector(7600.0f, 0.0f, 85.0f),
        FVector(9900.0f, 3400.0f, 1750.0f)
    };

    for (const FVector& PickupPosition : Pickups)
    {
        GetWorld()->SpawnActor<ABoostPickup>(ABoostPickup::StaticClass(), PickupPosition, FRotator::ZeroRotator);
    }
}
