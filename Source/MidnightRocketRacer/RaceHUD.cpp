#include "RaceHUD.h"

#include "ArcadeRacerPawn.h"
#include "Engine/Canvas.h"
#include "Engine/Engine.h"
#include "CanvasItem.h"
#include "MidnightRocketRacerGameMode.h"

void ARaceHUD::DrawHUD()
{
    Super::DrawHUD();

    if (!Canvas || !GEngine)
    {
        return;
    }

    const AMidnightRocketRacerGameMode* GameMode = GetWorld()->GetAuthGameMode<AMidnightRocketRacerGameMode>();
    const AArcadeRacerPawn* Racer = Cast<AArcadeRacerPawn>(GetOwningPawn());
    if (!GameMode || !Racer)
    {
        return;
    }

    UFont* Font = GEngine->GetLargeFont();
    const FLinearColor Cyan(0.15f, 0.75f, 1.0f, 1.0f);
    const FLinearColor Lime(0.34f, 1.0f, 0.42f, 1.0f);
    const FLinearColor Pink(1.0f, 0.12f, 0.48f, 1.0f);

    const FString SpeedText = FString::Printf(TEXT("%03d KM/H"), FMath::RoundToInt(Racer->GetSpeedKph()));
    const FString BoostText = FString::Printf(TEXT("BOOST  %03d%%"), FMath::RoundToInt(Racer->GetBoostEnergy()));
    const FString TimerText = FString::Printf(TEXT("%02d:%05.2f"), FMath::FloorToInt(GameMode->GetRaceTime() / 60.0f), FMath::Fmod(GameMode->GetRaceTime(), 60.0f));

    const auto DrawLabel = [this, Font](const FString& Text, float X, float Y, float Scale, const FLinearColor& Color)
    {
        FCanvasTextItem Item(FVector2D(X, Y), FText::FromString(Text), Font, Color);
        Item.Scale = FVector2D(Scale, Scale);
        Item.EnableShadow(FLinearColor::Black);
        Canvas->DrawItem(Item);
    };

    DrawLabel(TEXT("MIDNIGHT // ROCKET RACER"), 56.0f, 44.0f, 1.2f, Cyan);
    DrawLabel(TimerText, Canvas->SizeX - 280.0f, 44.0f, 1.5f, Cyan);
    DrawLabel(SpeedText, 56.0f, Canvas->SizeY - 150.0f, 1.7f, Cyan);
    DrawLabel(BoostText, 56.0f, Canvas->SizeY - 98.0f, 1.05f, Lime);
    DrawLabel(FString::Printf(TEXT("GATE %d / 4"), GameMode->GetNextCheckpoint() + 1), Canvas->SizeX - 250.0f, Canvas->SizeY - 98.0f, 1.05f, Pink);

    if (GameMode->GetCountdown() > 0.0f)
    {
        const FString CountdownText = FString::FromInt(FMath::CeilToInt(GameMode->GetCountdown()));
        DrawLabel(CountdownText, Canvas->SizeX * 0.5f - 24.0f, Canvas->SizeY * 0.35f, 3.2f, Pink);
    }
    else if (GameMode->IsRaceFinished())
    {
        DrawLabel(TEXT("FINISH // RUN COMPLETE"), Canvas->SizeX * 0.5f - 270.0f, Canvas->SizeY * 0.35f, 1.7f, Lime);
    }
}
