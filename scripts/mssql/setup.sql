IF NOT EXISTS (
  SELECT *
  FROM sys.databases
  WHERE name = 'RPA.Finance.CrossBorder.PaymentEngine'
)
BEGIN
  CREATE DATABASE [RPA.Finance.CrossBorder.PaymentEngine]
END
GO

USE [RPA.Finance.CrossBorder.PaymentEngine];
GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[messages]') AND type in (N'U'))

BEGIN
  CREATE TABLE [dbo].[messages](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [invoice_id] [int] NOT NULL,
    [received] [datetime] NOT NULL,
    [sent] [datetime] NULL,
    [message_in] [xml] NULL,
    [message_out] [xml] NULL,
    [message_live] [xml] NULL
  )
END
