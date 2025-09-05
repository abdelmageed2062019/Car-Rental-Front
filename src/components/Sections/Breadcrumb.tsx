import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  currentPage: string;
  text: string;
}

const Breadcrumb = ({ currentPage, text }: BreadcrumbProps) => {
  return (
    <div className="pt-6">
      <div className="text-center mt-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {text}
        </h2>
      </div>
      <nav aria-label="Breadcrumb">
        <ol
          role="list"
          className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
        >
          <li>
            <div className="flex items-center">
              <Link
                href="/"
                className="mr-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200"
              >
                Home
              </Link>
              <ChevronRight className="h-5 w-4 text-gray-300" />
            </div>
          </li>
          <li className="text-sm">
            <span aria-current="page" className="font-medium text-gray-500">
              {currentPage}
            </span>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
