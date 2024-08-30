import ConnectWallet from "./ConnectWallet"; // Keep the import statement intact

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold">Welcome to My App</h1>
      <ConnectWallet />
    </header>
  );
};

export default Header; // Correct export statement 
