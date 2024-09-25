const Button = ({ children, ...props }: any) => (
  <button
    {...props}
    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    {children}
  </button>
);

export default Button;
