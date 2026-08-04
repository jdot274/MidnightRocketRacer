import unreal

map_path = "/Game/Maps/MidnightArena"

if unreal.EditorAssetLibrary.does_asset_exist(map_path):
    unreal.log("MidnightArena already exists; preserving the existing map.")
else:
    unreal.EditorLevelLibrary.new_level(map_path)
    unreal.EditorLevelLibrary.save_current_level()
    unreal.log("Created MidnightArena map.")
