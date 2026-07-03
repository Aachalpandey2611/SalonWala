import { Supplier, SupplierStatus } from '../models/Supplier';
import { SupplierContact } from '../models/SupplierContact';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';

export class SupplierService {
  
  static async createSupplier(salonId: string, payload: any) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const supplier = await Supplier.create([{
        salonId,
        companyName: payload.companyName,
        gstNumber: payload.gstNumber,
        panNumber: payload.panNumber,
        paymentTerms: payload.paymentTerms,
        bankDetails: payload.bankDetails,
        address: payload.address,
        isPreferred: payload.isPreferred || false
      }], { session });

      if (payload.contacts && payload.contacts.length > 0) {
        const contacts = payload.contacts.map((c: any) => ({
          supplierId: supplier[0]._id,
          ...c
        }));
        await SupplierContact.insertMany(contacts, { session });
      }

      await session.commitTransaction();
      return supplier[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getSuppliers(salonId: string) {
    return await Supplier.find({ salonId }).sort({ companyName: 1 });
  }

  static async updateSupplierStatus(supplierId: string, status: SupplierStatus) {
    const supplier = await Supplier.findByIdAndUpdate(supplierId, { status }, { new: true });
    if (!supplier) throw new AppError('Supplier not found', 404);
    return supplier;
  }
}
