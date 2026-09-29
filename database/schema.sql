/*
  Portal de Propuestas TIBOX
  SQL Server / Azure SQL MVP schema
*/

IF OBJECT_ID('dbo.ProposalEvents', 'U') IS NOT NULL DROP TABLE dbo.ProposalEvents;
IF OBJECT_ID('dbo.ProposalAssets', 'U') IS NOT NULL DROP TABLE dbo.ProposalAssets;
IF OBJECT_ID('dbo.Proposals', 'U') IS NOT NULL DROP TABLE dbo.Proposals;
GO

CREATE TABLE dbo.Proposals (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Proposals PRIMARY KEY,
  public_token NVARCHAR(80) NOT NULL CONSTRAINT UQ_Proposals_PublicToken UNIQUE,
  client_name NVARCHAR(200) NOT NULL,
  client_rut NVARCHAR(30) NULL,
  contact_name NVARCHAR(200) NOT NULL,
  contact_email NVARCHAR(320) NOT NULL,
  kam_name NVARCHAR(200) NOT NULL,
  opportunity_number NVARCHAR(100) NULL,
  title NVARCHAR(300) NOT NULL,
  status VARCHAR(20) NOT NULL CONSTRAINT DF_Proposals_Status DEFAULT ('draft'),
  access_type VARCHAR(10) NOT NULL,
  pin_hash NVARCHAR(255) NULL,
  format VARCHAR(10) NOT NULL,
  expires_at DATETIME2 NOT NULL,
  views INT NOT NULL CONSTRAINT DF_Proposals_Views DEFAULT (0),
  last_viewed_at DATETIME2 NULL,
  created_at DATETIME2 NOT NULL CONSTRAINT DF_Proposals_Created DEFAULT (SYSUTCDATETIME()),
  updated_at DATETIME2 NOT NULL CONSTRAINT DF_Proposals_Updated DEFAULT (SYSUTCDATETIME()),

  CONSTRAINT CK_Proposals_Status CHECK (status IN ('draft','sent','viewed','expired','revoked')),
  CONSTRAINT CK_Proposals_AccessType CHECK (access_type IN ('pin','otp')),
  CONSTRAINT CK_Proposals_Format CHECK (format IN ('html','pdf','pptx'))
);
GO

CREATE INDEX IX_Proposals_ClientName ON dbo.Proposals(client_name);
CREATE INDEX IX_Proposals_Status ON dbo.Proposals(status);
CREATE INDEX IX_Proposals_ExpiresAt ON dbo.Proposals(expires_at);
GO

CREATE TABLE dbo.ProposalAssets (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_ProposalAssets PRIMARY KEY,
  proposal_id UNIQUEIDENTIFIER NOT NULL,
  storage_key NVARCHAR(900) NOT NULL,
  storage_provider VARCHAR(30) NOT NULL,
  original_file_name NVARCHAR(500) NOT NULL,
  mime_type NVARCHAR(200) NOT NULL,
  size_bytes BIGINT NOT NULL,
  created_at DATETIME2 NOT NULL CONSTRAINT DF_ProposalAssets_Created DEFAULT (SYSUTCDATETIME()),

  CONSTRAINT FK_ProposalAssets_Proposal
    FOREIGN KEY (proposal_id) REFERENCES dbo.Proposals(id) ON DELETE CASCADE,

  CONSTRAINT CK_ProposalAssets_StorageProvider
    CHECK (storage_provider IN ('azure-blob','local'))
);
GO

CREATE INDEX IX_ProposalAssets_ProposalId ON dbo.ProposalAssets(proposal_id);
GO

CREATE TABLE dbo.ProposalEvents (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_ProposalEvents PRIMARY KEY,
  proposal_id UNIQUEIDENTIFIER NOT NULL,
  event_type VARCHAR(40) NOT NULL,
  section_id NVARCHAR(200) NULL,
  metadata_json NVARCHAR(MAX) NULL,
  created_at DATETIME2 NOT NULL CONSTRAINT DF_ProposalEvents_Created DEFAULT (SYSUTCDATETIME()),

  CONSTRAINT FK_ProposalEvents_Proposal
    FOREIGN KEY (proposal_id) REFERENCES dbo.Proposals(id) ON DELETE CASCADE,

  CONSTRAINT CK_ProposalEvents_MetadataJson
    CHECK (metadata_json IS NULL OR ISJSON(metadata_json) = 1)
);
GO

CREATE INDEX IX_ProposalEvents_ProposalCreated
  ON dbo.ProposalEvents(proposal_id, created_at DESC);
GO
