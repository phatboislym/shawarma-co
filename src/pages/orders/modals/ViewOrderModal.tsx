import React, { useEffect } from 'react';
import Modal from '../../../components/Modal';
import { IoClose } from "react-icons/io5";
import {  useAppDispatch, useAppSelector} from '../../../state-control/store/hooks'
import { fetchAllOrders, fetchOrderById, selectOrderRecord } from '../../../state-control/features/orderSlice';


type ModalProps = {
    viewModalIsOpen: boolean;
    setViewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    id?: string;
  };

const ViewTicketModal = ({ viewModalIsOpen, setViewModalOpen }: ModalProps) => {
  const dispatch = useAppDispatch();
  const orderRecord = useAppSelector(selectOrderRecord);
  const orderId = orderRecord.id_ && orderRecord.id_
  console.log(orderRecord, "OR")

  useEffect( () => {
      dispatch(fetchOrderById(orderId));
  }, [dispatch]);

  return (
    <Modal modalIsOpen={viewModalIsOpen} setModalOpen={setViewModalOpen}>
      <div className="flex items-center justify-end mb-4">
        <button className="text-xl" onClick={() => setViewModalOpen(false)}>
          <IoClose />
        </button>
      </div>
      <div className="flex flex-col  px-4 md:px-5 mb-32 space-y-7">
            <h2 className="text-blue text-3xl">Order Details</h2>
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-4"> Quantity </div>
                <div className="col-span-8"> { orderRecord.quantity ? orderRecord.quantity : "" } </div>
                <div className="col-span-4"> Size </div>
                <div className="col-span-8"> { orderRecord.size ? orderRecord.size.value : "" } </div>
                <div className="col-span-4"> Spiciness </div>
                <div className="col-span-8"> { orderRecord.spicyness ? orderRecord.spicyness.value : "" } </div>
                <div className="col-span-4"> Status </div>
                <div className="col-span-8"> { orderRecord.status ? orderRecord.status.value : "" } </div>                 
            </div>
        
      </div>
    </Modal>
  );
};

export default ViewTicketModal ;
