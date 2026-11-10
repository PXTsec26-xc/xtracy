import os
import glob

files = [
    'NOTICE.md',
    'XTRACY_FOUNDER_IMPLEMENTATION_REPORT.md',
    'XTRACY_FOUNDER_PRIVACY_AUDIT_REPORT.md',
    'XTRACY_GLOBAL_UPGRADE_REPORT.md',
] + glob.glob('XTRACY_FOUNDER_RECORDS/*.md') + glob.glob('docs/*.md')

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        trimmed_lines = [line.rstrip() + '\n' for line in lines]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(trimmed_lines)
        print(f"Trimmed: {filepath}")
