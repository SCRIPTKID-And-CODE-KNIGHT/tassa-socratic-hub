const PastResultsPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-red-600">🚧 Page Under Maintenance 🚧</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Sorry for the inconvenience. Our Past Results page is currently undergoing updates.
        Please check back later.
      </p>
      <img
        src="/maintenance-illustration.png"
        alt="Under Maintenance"
        className="max-w-xs mx-auto mb-6"
      />
      <p className="text-sm text-gray-500">Thank you for your patience!</p>
    </div>
  );
};

export default PastResultsPage;                    
