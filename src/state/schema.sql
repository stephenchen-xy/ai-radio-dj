create table if not exists storyline_state (
  id integer primary key check (id = 1),
  mainline_label text not null,
  current_segment_label text not null,
  dominant_driver text not null,
  confidence real not null,
  last_narration_at text
);
