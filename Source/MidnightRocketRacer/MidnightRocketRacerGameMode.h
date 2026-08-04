#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "MidnightRocketRacerGameMode.generated.h"

UCLASS()
class MIDNIGHTROCKETRACER_API AMidnightRocketRacerGameMode : public AGameModeBase
{
    GENERATED_BODY()

public:
    AMidnightRocketRacerGameMode();

    virtual void Tick(float DeltaSeconds) override;

    void RegisterCheckpoint(int32 CheckpointIndex);

    UFUNCTION(BlueprintPure, Category = "Race")
    float GetRaceTime() const { return RaceTime; }

    UFUNCTION(BlueprintPure, Category = "Race")
    float GetCountdown() const { return Countdown; }

    UFUNCTION(BlueprintPure, Category = "Race")
    int32 GetNextCheckpoint() const { return NextCheckpoint; }

    UFUNCTION(BlueprintPure, Category = "Race")
    bool IsRaceFinished() const { return bRaceFinished; }

protected:
    virtual void BeginPlay() override;

private:
    void SpawnRaceRoute();

    float Countdown = 3.0f;
    float RaceTime = 0.0f;
    int32 NextCheckpoint = 0;
    bool bRaceStarted = false;
    bool bRaceFinished = false;
};
