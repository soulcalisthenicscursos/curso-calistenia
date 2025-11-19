export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
        <div>
          Curso creado por{' '}
          <a
            href="https://www.instagram.com/agustin_arese"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-green-800 hover:text-green-900 transition-colors"
          >
            <strong>Agustín Arese</strong>
          </a>
        </div>
        <div>
          Sitio web desarrollado por{' '}
          <a
            href="https://www.instagram.com/dev.novateam"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-green-800 hover:text-green-900 transition-colors"
          >
            <strong>Nova Team</strong>
          </a>
        </div>
      </div>
    </footer>
  );
}

