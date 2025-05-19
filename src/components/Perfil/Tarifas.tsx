
type Props = {
  csrfToken: string;
};

export default function Tarifas({ csrfToken }: Props) {
 
return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Tarifas</h1>
      <p className="text-lg mb-2">Consulta nuestras tarifas para alquiler de material y clases.</p>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Alquiler de Material</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Esquí: 30€ por día</li>
          <li>Snowboard: 35€ por día</li>        
        </ul>
        <h2 className="text-xl font-semibold mb-4">Clases</h2>
        <ul className="list-disc list-inside">
          <li>Esquí: 20€ por clase</li>
          <li>Snowboard: 25€ por clase</li>
        </ul>
      </div>
    </div>
  );
}
