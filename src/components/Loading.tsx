import { Spinner } from './ui/spinner';

const Loading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Spinner />
    </div>
  );
};

export default Loading;
