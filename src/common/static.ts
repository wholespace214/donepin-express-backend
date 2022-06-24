export const standardTypeData = (data: any, adminId: any, teamId: any) => {
  return {
    adminId: adminId,
    teamId: teamId,
    clientId: data.clientId,
    invoiceType: data.invoiceType,
    invoice: data.invoice,
    purchaseOrder: data.purchaseOrder,
    InvoiceDate: data.InvoiceDate,
    dueDate: data.dueDate,
    projectId: data.projectId,
    company: data.company,
    currency: data.currency,
    invoiceLanguage: data.invoiceLanguage,
  };
};

export const recurringInvoiceData = (data: any, adminId: any, teamId: any) => {
  return {
    adminId: adminId,
    teamId: teamId,
    clientId: data.clientId,
    invoiceType: data.invoiceType,
    invoice: data.invoice,
    purchaseOrder: data.purchaseOrder,
    InvoiceDate: data.InvoiceDate,
    dueDate: data.dueDate,
    projectId: data.projectId,
    company: data.company,
    currency: data.currency,
    invoiceLanguage: data.invoiceLanguage,
    billingFrequently: data.billingFrequently,
    billingCycle: data.billingCycle,
    item: data.item,
    totalAmount: data.totalAmount,
    note: data.note,
    discount: data.discount,
  };
};

export const timeLogInvoiceData = (data: any, adminId: any, teamId: any) => {
  return {
    adminId: adminId,
    teamId: teamId,
    clientId: data.clientId,
    invoiceType: data.invoiceType,
    invoice: data.invoice,
    purchaseOrder: data.purchaseOrder,
    InvoiceDate: data.InvoiceDate,
    dueDate: data.dueDate,
    projectId: data.projectId,
    company: data.company,
    currency: data.currency,
    invoiceLanguage: data.invoiceLanguage,
    timeLogFrom: data.timeLogFrom,
    timeLogTo: data.timeLog,
    item: data.item,
    totalAmount: data.totalAmount,
    note: data.note,
    discount: data.discount,
  };
};

