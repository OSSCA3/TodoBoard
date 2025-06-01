interface ModalHeaderProps {
  title: string;
}

const ModalHeader = ({ title }: ModalHeaderProps) => {
  return (
    <h3 id="modal-header" className="p-4 text-2xl text-black">
      {title}
    </h3>
  );
};

export default ModalHeader;
