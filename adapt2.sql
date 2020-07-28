--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: createadaid(); Type: FUNCTION; Schema: public; Owner: adapt2Admin
--

CREATE FUNCTION createadaid() RETURNS trigger
    LANGUAGE plpgsql
    AS $$    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- making use of the special variable TG_OP to work out the operation.
        --
        UPDATE datasets SET adaid = LPAD( NEW.id::varchar(255), 6, '0') WHERE id = NEW.id;
            IF NOT FOUND THEN RETURN NULL; END IF;
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$$;


ALTER FUNCTION public.createadaid() OWNER TO "adapt2Admin";

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: datasetAuthors; Type: TABLE; Schema: public; Owner: adapt2Admin; Tablespace:
--

CREATE TABLE "datasetAuthors" (
    id integer NOT NULL,
    datasetid integer,
    name character varying(255),
    affiliation character varying(255)
);


ALTER TABLE public."datasetAuthors" OWNER TO "adapt2Admin";

--
-- Name: datasetAuthors_id_seq; Type: SEQUENCE; Schema: public; Owner: adapt2Admin
--

CREATE SEQUENCE "datasetAuthors_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."datasetAuthors_id_seq" OWNER TO "adapt2Admin";

--
-- Name: datasetAuthors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adapt2Admin
--

ALTER SEQUENCE "datasetAuthors_id_seq" OWNED BY "datasetAuthors".id;


--
-- Name: datasets; Type: TABLE; Schema: public; Owner: adapt2Admin; Tablespace:
--

CREATE TABLE datasets (
    id integer NOT NULL,
    doi character varying(255),
    title character varying(255),
    author character varying(255),
    email character varying(255),
    description character varying(255),
    subject character varying(255),
    adaid character varying(255),
    server integer,
    dataverse integer,
    userid integer
);


ALTER TABLE public.datasets OWNER TO "adapt2Admin";

--
-- Name: datasets_id_seq; Type: SEQUENCE; Schema: public; Owner: adapt2Admin
--

CREATE SEQUENCE datasets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.datasets_id_seq OWNER TO "adapt2Admin";

--
-- Name: datasets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adapt2Admin
--

ALTER SEQUENCE datasets_id_seq OWNED BY datasets.id;


--
-- Name: dataverseAPI; Type: TABLE; Schema: public; Owner: adapt2Admin; Tablespace:
--

CREATE TABLE "dataverseAPI" (
    id integer NOT NULL,
    userid integer,
    serverid integer,
    "API" character varying(255)
);


ALTER TABLE public."dataverseAPI" OWNER TO "adapt2Admin";

--
-- Name: dataverseAPI_id_seq; Type: SEQUENCE; Schema: public; Owner: adapt2Admin
--

CREATE SEQUENCE "dataverseAPI_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."dataverseAPI_id_seq" OWNER TO "adapt2Admin";

--
-- Name: dataverseAPI_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adapt2Admin
--

ALTER SEQUENCE "dataverseAPI_id_seq" OWNED BY "dataverseAPI".id;


--
-- Name: dataverseSubjects; Type: TABLE; Schema: public; Owner: adapt2Admin; Tablespace:
--

CREATE TABLE "dataverseSubjects" (
    id integer NOT NULL,
    subjectname character varying(255)
);


ALTER TABLE public."dataverseSubjects" OWNER TO "adapt2Admin";

--
-- Name: dataverseSubjects_id_seq; Type: SEQUENCE; Schema: public; Owner: adapt2Admin
--

CREATE SEQUENCE "dataverseSubjects_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."dataverseSubjects_id_seq" OWNER TO "adapt2Admin";

--
-- Name: dataverseSubjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adapt2Admin
--

ALTER SEQUENCE "dataverseSubjects_id_seq" OWNED BY "dataverseSubjects".id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: adapt2Admin; Tablespace:
--

CREATE TABLE files (
    id integer NOT NULL,
    originalname character varying(255),
    filename character varying(255),
    path character varying(255),
    datasetid integer
);


ALTER TABLE public.files OWNER TO "adapt2Admin";

--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: adapt2Admin
--

CREATE SEQUENCE files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.files_id_seq OWNER TO "adapt2Admin";

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adapt2Admin
--

ALTER SEQUENCE files_id_seq OWNED BY files.id;


--
-- Name: loginLogs; Type: TABLE; Schema: public; Owner: adapt2Admin; Tablespace:
--

CREATE TABLE "loginLogs" (
    id integer NOT NULL,
    "userID" integer,
    "DateTime" character varying(255)
);


ALTER TABLE public."loginLogs" OWNER TO "adapt2Admin";

--
-- Name: loginLogs_id_seq; Type: SEQUENCE; Schema: public; Owner: adapt2Admin
--

CREATE SEQUENCE "loginLogs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."loginLogs_id_seq" OWNER TO "adapt2Admin";

--
-- Name: loginLogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adapt2Admin
--

ALTER SEQUENCE "loginLogs_id_seq" OWNED BY "loginLogs".id;


--
-- Name: operationLog; Type: TABLE; Schema: public; Owner: adapt2Admin; Tablespace:
--

CREATE TABLE "operationLog" (
    id integer NOT NULL,
    userid integer,
    operationid integer,
    datetime character varying(255),
    datasetid integer,
    fileid integer,
    apiid integer,
    dataverseid integer,
    "remoteDatasetid" integer,
    serverid integer
);


ALTER TABLE public."operationLog" OWNER TO "adapt2Admin";

--
-- Name: operationLog_id_seq; Type: SEQUENCE; Schema: public; Owner: adapt2Admin
--

CREATE SEQUENCE "operationLog_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."operationLog_id_seq" OWNER TO "adapt2Admin";

--
-- Name: operationLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adapt2Admin
--

ALTER SEQUENCE "operationLog_id_seq" OWNED BY "operationLog".id;


--
-- Name: operations; Type: TABLE; Schema: public; Owner: adapt2Admin; Tablespace:
--

CREATE TABLE operations (
    id integer NOT NULL,
    "operationName" character varying
);


ALTER TABLE public.operations OWNER TO "adapt2Admin";

--
-- Name: operations_id_seq; Type: SEQUENCE; Schema: public; Owner: adapt2Admin
--

CREATE SEQUENCE operations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.operations_id_seq OWNER TO "adapt2Admin";

--
-- Name: operations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adapt2Admin
--

ALTER SEQUENCE operations_id_seq OWNED BY operations.id;


--
-- Name: servers; Type: TABLE; Schema: public; Owner: adapt2Admin; Tablespace:
--

CREATE TABLE servers (
    id integer NOT NULL,
    servername character varying(255),
    url character varying(255),
    alias character varying(255)
);


ALTER TABLE public.servers OWNER TO "adapt2Admin";

--
-- Name: servers_id_seq; Type: SEQUENCE; Schema: public; Owner: adapt2Admin
--

CREATE SEQUENCE servers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.servers_id_seq OWNER TO "adapt2Admin";

--
-- Name: servers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adapt2Admin
--

ALTER SEQUENCE servers_id_seq OWNED BY servers.id;


--
-- Name: uploadFiles; Type: TABLE; Schema: public; Owner: adapt2Admin; Tablespace:
--

CREATE TABLE "uploadFiles" (
    id integer NOT NULL,
    "originalName" character varying(255),
    "fileName" character varying(255),
    path character varying(255),
    size character varying(255),
    datetime character varying(255),
    localdatasetid integer
);


ALTER TABLE public."uploadFiles" OWNER TO "adapt2Admin";

--
-- Name: uploadFiles_id_seq; Type: SEQUENCE; Schema: public; Owner: adapt2Admin
--

CREATE SEQUENCE "uploadFiles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."uploadFiles_id_seq" OWNER TO "adapt2Admin";

--
-- Name: uploadFiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adapt2Admin
--

ALTER SEQUENCE "uploadFiles_id_seq" OWNED BY "uploadFiles".id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: adapt2Admin; Tablespace:
--

CREATE TABLE users (
    "userID" integer NOT NULL,
    "userName" character varying(255),
    "userEmail" character varying(255)
);


ALTER TABLE public.users OWNER TO "adapt2Admin";

--
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: adapt2Admin
--

CREATE SEQUENCE users_userid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_userid_seq OWNER TO "adapt2Admin";

--
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adapt2Admin
--

ALTER SEQUENCE users_userid_seq OWNED BY users."userID";


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adapt2Admin
--

ALTER TABLE ONLY "datasetAuthors" ALTER COLUMN id SET DEFAULT nextval('"datasetAuthors_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adapt2Admin
--

ALTER TABLE ONLY datasets ALTER COLUMN id SET DEFAULT nextval('datasets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adapt2Admin
--

ALTER TABLE ONLY "dataverseAPI" ALTER COLUMN id SET DEFAULT nextval('"dataverseAPI_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adapt2Admin
--

ALTER TABLE ONLY "dataverseSubjects" ALTER COLUMN id SET DEFAULT nextval('"dataverseSubjects_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adapt2Admin
--

ALTER TABLE ONLY files ALTER COLUMN id SET DEFAULT nextval('files_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adapt2Admin
--

ALTER TABLE ONLY "loginLogs" ALTER COLUMN id SET DEFAULT nextval('"loginLogs_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adapt2Admin
--

ALTER TABLE ONLY "operationLog" ALTER COLUMN id SET DEFAULT nextval('"operationLog_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adapt2Admin
--

ALTER TABLE ONLY operations ALTER COLUMN id SET DEFAULT nextval('operations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adapt2Admin
--

ALTER TABLE ONLY servers ALTER COLUMN id SET DEFAULT nextval('servers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: adapt2Admin
--

ALTER TABLE ONLY "uploadFiles" ALTER COLUMN id SET DEFAULT nextval('"uploadFiles_id_seq"'::regclass);


--
-- Name: userID; Type: DEFAULT; Schema: public; Owner: adapt2Admin
--

ALTER TABLE ONLY users ALTER COLUMN "userID" SET DEFAULT nextval('users_userid_seq'::regclass);


--
-- Data for Name: datasetAuthors; Type: TABLE DATA; Schema: public; Owner: adapt2Admin
--

COPY "datasetAuthors" (id, datasetid, name, affiliation) FROM stdin;
\.


--
-- Name: datasetAuthors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adapt2Admin
--

SELECT pg_catalog.setval('"datasetAuthors_id_seq"', 1, false);


--
-- Data for Name: datasets; Type: TABLE DATA; Schema: public; Owner: adapt2Admin
--

COPY datasets (id, doi, title, author, email, description, subject, adaid, server, dataverse, userid) FROM stdin;
1	\N	abc	\N	\N	\N	\N	000001	\N	\N	\N
\.


--
-- Name: datasets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adapt2Admin
--

SELECT pg_catalog.setval('datasets_id_seq', 1, true);


--
-- Data for Name: dataverseAPI; Type: TABLE DATA; Schema: public; Owner: adapt2Admin
--

COPY "dataverseAPI" (id, userid, serverid, "API") FROM stdin;
\.


--
-- Name: dataverseAPI_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adapt2Admin
--

SELECT pg_catalog.setval('"dataverseAPI_id_seq"', 1, false);


--
-- Data for Name: dataverseSubjects; Type: TABLE DATA; Schema: public; Owner: adapt2Admin
--

COPY "dataverseSubjects" (id, subjectname) FROM stdin;
1	Agricultural Sciences
2	Arts and Humanities
3	Astronomy and Astrophysics
4	Business and Management
5	Chemistry
6	Computer and Information Science
7	Earth and Environmental Sciences
8	Engineering
9	Law
10	Mathematical Sciences
11	Medicine, Health and Life Sciences
12	Physics
13	Social Sciences
14	Other
\.


--
-- Name: dataverseSubjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adapt2Admin
--

SELECT pg_catalog.setval('"dataverseSubjects_id_seq"', 14, true);


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: adapt2Admin
--

COPY files (id, originalname, filename, path, datasetid) FROM stdin;
\.


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adapt2Admin
--

SELECT pg_catalog.setval('files_id_seq', 1, false);


--
-- Data for Name: loginLogs; Type: TABLE DATA; Schema: public; Owner: adapt2Admin
--

COPY "loginLogs" (id, "userID", "DateTime") FROM stdin;
\.


--
-- Name: loginLogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adapt2Admin
--

SELECT pg_catalog.setval('"loginLogs_id_seq"', 1, false);


--
-- Data for Name: operationLog; Type: TABLE DATA; Schema: public; Owner: adapt2Admin
--

COPY "operationLog" (id, userid, operationid, datetime, datasetid, fileid, apiid, dataverseid, "remoteDatasetid", serverid) FROM stdin;
\.


--
-- Name: operationLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adapt2Admin
--

SELECT pg_catalog.setval('"operationLog_id_seq"', 1, false);


--
-- Data for Name: operations; Type: TABLE DATA; Schema: public; Owner: adapt2Admin
--

COPY operations (id, "operationName") FROM stdin;
1	create ADAID
2	create a local dataset
3	create a dataverse dataset
4	migrate a dataset to a local directory
5	upload a new dataverse API
6	update an existing dataverse API
7	upload files to a dataverse dataset
\.


--
-- Name: operations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adapt2Admin
--

SELECT pg_catalog.setval('operations_id_seq', 7, true);


--
-- Data for Name: servers; Type: TABLE DATA; Schema: public; Owner: adapt2Admin
--

COPY servers (id, servername, url, alias) FROM stdin;
1	Self Deposit Dataverse	https://deposit.ada.edu.au/	selfDepost
2	Production Dataverse	https://dataverse.ada.edu.au/	production
3	Test Dataverse	https://dataverse-test.ada.edu.au/	test
4	Dev Dataverse	https://dataverse-dev.ada.edu.au/	dev
\.


--
-- Name: servers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adapt2Admin
--

SELECT pg_catalog.setval('servers_id_seq', 4, true);


--
-- Data for Name: uploadFiles; Type: TABLE DATA; Schema: public; Owner: adapt2Admin
--

COPY "uploadFiles" (id, "originalName", "fileName", path, size, datetime, localdatasetid) FROM stdin;
\.


--
-- Name: uploadFiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adapt2Admin
--

SELECT pg_catalog.setval('"uploadFiles_id_seq"', 1, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: adapt2Admin
--

COPY users ("userID", "userName", "userEmail") FROM stdin;
1	Mingjing Peng	Mingjing.Peng@anu.edu.au
\.


--
-- Name: users_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: adapt2Admin
--

SELECT pg_catalog.setval('users_userid_seq', 1, true);


--
-- Name: datasetAuthors_pkey; Type: CONSTRAINT; Schema: public; Owner: adapt2Admin; Tablespace:
--

ALTER TABLE ONLY "datasetAuthors"
    ADD CONSTRAINT "datasetAuthors_pkey" PRIMARY KEY (id);


--
-- Name: datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: adapt2Admin; Tablespace:
--

ALTER TABLE ONLY datasets
    ADD CONSTRAINT datasets_pkey PRIMARY KEY (id);


--
-- Name: dataverseAPI_pkey; Type: CONSTRAINT; Schema: public; Owner: adapt2Admin; Tablespace:
--

ALTER TABLE ONLY "dataverseAPI"
    ADD CONSTRAINT "dataverseAPI_pkey" PRIMARY KEY (id);


--
-- Name: dataverseSubjects_pkey; Type: CONSTRAINT; Schema: public; Owner: adapt2Admin; Tablespace:
--

ALTER TABLE ONLY "dataverseSubjects"
    ADD CONSTRAINT "dataverseSubjects_pkey" PRIMARY KEY (id);


--
-- Name: files_pkey; Type: CONSTRAINT; Schema: public; Owner: adapt2Admin; Tablespace:
--

ALTER TABLE ONLY files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: loginLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: adapt2Admin; Tablespace:
--

ALTER TABLE ONLY "loginLogs"
    ADD CONSTRAINT "loginLogs_pkey" PRIMARY KEY (id);


--
-- Name: operationLog_pkey; Type: CONSTRAINT; Schema: public; Owner: adapt2Admin; Tablespace:
--

ALTER TABLE ONLY "operationLog"
    ADD CONSTRAINT "operationLog_pkey" PRIMARY KEY (id);


--
-- Name: operations_pkey; Type: CONSTRAINT; Schema: public; Owner: adapt2Admin; Tablespace:
--

ALTER TABLE ONLY operations
    ADD CONSTRAINT operations_pkey PRIMARY KEY (id);


--
-- Name: servers_pkey; Type: CONSTRAINT; Schema: public; Owner: adapt2Admin; Tablespace:
--

ALTER TABLE ONLY servers
    ADD CONSTRAINT servers_pkey PRIMARY KEY (id);


--
-- Name: uploadFiles_pkey; Type: CONSTRAINT; Schema: public; Owner: adapt2Admin; Tablespace:
--

ALTER TABLE ONLY "uploadFiles"
    ADD CONSTRAINT "uploadFiles_pkey" PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: adapt2Admin; Tablespace:
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("userID");


--
-- Name: createadaid_trigger; Type: TRIGGER; Schema: public; Owner: adapt2Admin
--

CREATE TRIGGER createadaid_trigger AFTER INSERT ON datasets FOR EACH ROW EXECUTE PROCEDURE createadaid();


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--
