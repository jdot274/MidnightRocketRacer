#pragma once

#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "RaceHUD.generated.h"

UCLASS()
class MIDNIGHTROCKETRACER_API ARaceHUD : public AHUD
{
    GENERATED_BODY()

public:
    virtual void DrawHUD() override;
};
