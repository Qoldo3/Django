import { Link } from 'react-router-dom';

function ActivationFailed() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <div className="bg-white rounded-2xl shadow-lg p-16 border border-gray-100">
        <div className="mb-12">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-6">
            Activation Failed
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The activation link is invalid or has expired.
          </p>
          <p className="text-base text-gray-500 mt-4">
            It may have already been used or the link is too old.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-md"
          >
            Back to Home
          </Link>
          <p className="text-sm text-gray-500">
            Need a new link? Try registering again or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ActivationFailed;