CREATE TABLE period
(
  id character varying(80) NOT NULL,
  begin date NOT NULL,
  "end" date NOT NULL,
  description character varying(255) NOT NULL DEFAULT '',
  PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE timea
  OWNER TO postgres;