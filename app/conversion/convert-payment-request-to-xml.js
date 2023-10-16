const xml2js = require('xml2js')
const moment = require('moment')
const { getId } = require('./get-id')
const { getBatchId } = require('./get-batch-id')
const { getBatchExportDate } = require('./get-batch-export-date')
const { convertInvoiceNumberForXml } = require('./convert-invoice-number-for-xml')
const { convertToPounds } = require('./currency-convert')

const convertPaymentRequestToXml = (paymentRequest) => {
  const formattedPaymentRequest = {
    Root: {
      $: {
        'xmlns:ns0': 'http://RPA.Integration.CalcNPay.Schemas.CalcNPayDebachedSchema/v1.1',
        ID: getId(paymentRequest.paymentRequestId)
      },
      Header: {
        SourceSystem: 'Payment Hub',
        DestinationSystem: 'Cross Border',
        SourceMessageId: getId(paymentRequest.paymentRequestId),
        LastStep: 'CalcNPay_BTS_RouterProcess',
        LastStepStatus: 'Success',
        NextStep: 'CalcNPay_BTS_CrossBorderProcess',
        NextStepType: 'Step',
        DateCreated: moment().format('YYYY-MM-DDTHH:mm:ss:SSS'),
        ManuallyAmendedBy: '',
        DebtReason: '',
        QualityCheckResult: '',
        SplitID: ''
      },
      Batch: {
        $: {
          InvoiceType: 'AP',
          CreatorID: 'SITI AGRI SYS',
          BatchID: getBatchId(paymentRequest.batch),
          BatchValue: convertToPounds(paymentRequest.value),
          NumberOfInvoices: 1,
          ExportDate: getBatchExportDate(paymentRequest.batch)
        }
      },
      Requests: {
        $: {
          MarketingYear: paymentRequest.marketingYear
        },
        Request: {
          Invoice: {
            $: {
              InvoiceCorrectionReference: '',
              RecoveryDate: '',
              OriginalSettlementDate: '',
              OriginalInvoiceNumber: '',
              PaymentPreferenceCurrency: paymentRequest.currency,
              DeliveryBody: 'CB00',
              TotalAmount: convertToPounds(paymentRequest.value),
              Pillar: 1,
              FRN: paymentRequest.frn,
              ClaimNumber: paymentRequest.contractNumber,
              RequestInvoiceNumber: paymentRequest.paymentRequestNumber.toString().padStart('3', '0'),
              InvoiceNumber: convertInvoiceNumberForXml(paymentRequest.invoiceNumber),
              InvoiceType: 'AP',
              SplitId: 1
            }
          },
          InvoiceLines: {
            InvoiceLine: paymentRequest.invoiceLines.map((invoiceLine, index) => ({
              $: {
                DeliveryBody: 'CB00',
                InvoiceNumber: convertInvoiceNumberForXml(paymentRequest.invoiceNumber),
                DebtType: '',
                AdjustmentValue: '',
                OriginalValue: convertToPounds(invoiceLine.value),
                DueDate: moment(paymentRequest.dueDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                LineTypeDescription: invoiceLine.description,
                LineID: index + 1,
                Fund: invoiceLine.fundCode,
                SchemeCode: invoiceLine.schemeCode,
                MarketingYear: paymentRequest.marketingYear,
                Value: convertToPounds(invoiceLine.value),
                SplitId: 1
              }
            }))
          }
        }
      }
    }
  }

  const builder = new xml2js.Builder({ headless: true })
  return builder.buildObject(formattedPaymentRequest)
}

module.exports = {
  convertPaymentRequestToXml
}
