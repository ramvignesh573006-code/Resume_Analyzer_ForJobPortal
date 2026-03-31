import os

path = r"c:\Users\M.vignesh\Downloads\final_1\lib\auth\useAuth.ts"
if os.path.exists(path):
    os.remove(path)
    print(f"Deleted: {path}")
else:
    print(f"Not found: {path}")
