import { createInvoiceService, getInvoiceService, getMyInvoicesService, updateInvoiceService, deleteInvoiceService } from "./invoice.service.js";

export const createInvoiceController = async (req, res, next) => {
    try {
        const invoice = await createInvoiceService(req.user, req.body);
        res.status(201).json(invoice);
    } catch (error) {
        next(error);
    }
};

export const getInvoiceController = async (req, res, next) => {
    try {
        const invoice = await getInvoiceService(req.user, req.params.id);
        res.status(200).json(invoice);
    } catch (error) {
        next(error);
    }
};

export const getMyInvoicesController = async (req, res, next) => {
    try {
        const invoices = await getMyInvoicesService(req.user);
        res.status(200).json(invoices);
    } catch (error) {
        next(error);
    }
};

export const updateInvoiceController = async (req, res, next) => {
    try {
        const invoice = await updateInvoiceService(req.user, req.params.id, req.body);
        res.status(200).json(invoice);
    } catch (error) {
        next(error);
    }
};

export const deleteInvoiceController = async (req, res, next) => {
    try {
        await deleteInvoiceService(req.user, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};