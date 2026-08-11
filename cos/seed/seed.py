"""Seed the memory database from seed_data.yaml. Idempotent — upserts by name.

Usage:  python -m seed.seed
"""

import json
from pathlib import Path

import yaml

from memory import db


def main() -> None:
    data = yaml.safe_load((Path(__file__).parent / "seed_data.yaml").read_text())
    created = updated = 0
    with db.connect() as conn:
        for ent in data["entities"]:
            attrs = json.dumps(ent.get("attrs", {}))
            eid = db.entity_id_by_name(conn, ent["name"])
            if eid:
                conn.execute(
                    "UPDATE entities SET kind=?, workstream=?, cadence=?, attrs=?, updated_at=? WHERE id=?",
                    (ent["kind"], ent["workstream"], ent.get("cadence", "daily"), attrs, db.now(), eid),
                )
                updated += 1
            else:
                conn.execute(
                    "INSERT INTO entities (name, kind, workstream, cadence, attrs, created_at, updated_at) "
                    "VALUES (?,?,?,?,?,?,?)",
                    (ent["name"], ent["kind"], ent["workstream"], ent.get("cadence", "daily"),
                     attrs, db.now(), db.now()),
                )
                created += 1
    print(f"Seeded: {created} created, {updated} updated → {db.DB_PATH}")


if __name__ == "__main__":
    main()
