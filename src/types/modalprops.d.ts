export type ModalProps = {
  modalIsOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string;
  title?: string;
  settingKey?: string;
  children?: React.ReactNode;
};
