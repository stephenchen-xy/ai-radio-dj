import Database from 'better-sqlite3';
import type { StorylineState } from '../domain/storyline';

export type PlannedSegmentState = {
  storylineLabel: string;
  dominantDriver: 'music' | 'environment' | 'request' | 'mixed';
  steeringStatus?: 'new' | 'continuing' | 'decaying' | 'expired' | 'promoted';
  narrationText: string;
  tracksJson: string;
};

export function createInMemoryDb() {
  const db = new Database(':memory:');
  db.exec(`
    create table if not exists storyline_state (
      id integer primary key check (id = 1),
      mainline_label text not null,
      current_segment_label text not null,
      dominant_driver text not null,
      confidence real not null,
      last_narration_at text
    );

    create table if not exists planned_segment (
      id integer primary key check (id = 1),
      storyline_label text not null,
      dominant_driver text not null,
      steering_status text,
      narration_text text not null,
      tracks_json text not null
    );
  `);
  return db;
}

export function saveStorylineState(db: Database.Database, state: StorylineState) {
  db.prepare(`
    insert into storyline_state (
      id, mainline_label, current_segment_label, dominant_driver, confidence, last_narration_at
    ) values (1, ?, ?, ?, ?, ?)
    on conflict(id) do update set
      mainline_label = excluded.mainline_label,
      current_segment_label = excluded.current_segment_label,
      dominant_driver = excluded.dominant_driver,
      confidence = excluded.confidence,
      last_narration_at = excluded.last_narration_at
  `).run(
    state.mainlineLabel,
    state.currentSegmentLabel,
    state.dominantDriver,
    state.confidence,
    state.lastNarrationAt ?? null
  );
}

export function loadStorylineState(db: Database.Database): StorylineState | undefined {
  const row = db.prepare(`select * from storyline_state where id = 1`).get() as
    | {
        mainline_label: string;
        current_segment_label: string;
        dominant_driver: 'music' | 'environment' | 'request' | 'mixed';
        confidence: number;
        last_narration_at: string | null;
      }
    | undefined;

  if (!row) return undefined;
  return {
    mainlineLabel: row.mainline_label,
    currentSegmentLabel: row.current_segment_label,
    dominantDriver: row.dominant_driver,
    confidence: row.confidence,
    lastNarrationAt: row.last_narration_at ?? undefined
  };
}

export function savePlannedSegment(db: Database.Database, segment: PlannedSegmentState) {
  db.prepare(`
    insert into planned_segment (
      id, storyline_label, dominant_driver, steering_status, narration_text, tracks_json
    ) values (1, ?, ?, ?, ?, ?)
    on conflict(id) do update set
      storyline_label = excluded.storyline_label,
      dominant_driver = excluded.dominant_driver,
      steering_status = excluded.steering_status,
      narration_text = excluded.narration_text,
      tracks_json = excluded.tracks_json
  `).run(
    segment.storylineLabel,
    segment.dominantDriver,
    segment.steeringStatus ?? null,
    segment.narrationText,
    segment.tracksJson
  );
}

export function loadPlannedSegment(db: Database.Database): PlannedSegmentState | undefined {
  const row = db.prepare(`select * from planned_segment where id = 1`).get() as
    | {
        storyline_label: string;
        dominant_driver: string;
        steering_status: string | null;
        narration_text: string;
        tracks_json: string;
      }
    | undefined;
  if (!row) return undefined;
  return {
    storylineLabel: row.storyline_label,
    dominantDriver: row.dominant_driver as PlannedSegmentState['dominantDriver'],
    steeringStatus: row.steering_status as PlannedSegmentState['steeringStatus'],
    narrationText: row.narration_text,
    tracksJson: row.tracks_json
  };
}
