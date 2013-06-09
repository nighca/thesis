-- Table: period

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


-- Table: zone

CREATE TABLE zone
(
  id character varying(80) NOT NULL,
  description character varying(255) NOT NULL DEFAULT ''::character varying,
  space geometry,
  CONSTRAINT zone_pkey PRIMARY KEY (id )
)
WITH (
  OIDS=FALSE
);
ALTER TABLE zone
  OWNER TO postgres;
