import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface SessionResult {
  session_id: string;
  ranking: number;
  priority_id: number;
  created_at: string;
  email: string;
  name: string;
  status: string;
}

interface SessionTableProps {
  results: SessionResult[];
  sessionId: string;
}

export const SessionTable: React.FC<SessionTableProps> = ({
  results,
  sessionId,
}) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-300";
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ranking</TableHead>
          <TableHead>Priority ID</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results
          .filter((result) => result.session_id === sessionId)
          .map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.ranking}</TableCell>
              <TableCell>{result.priority_id}</TableCell>
              <TableCell>
                {new Date(result.created_at).toLocaleString()}
              </TableCell>
              <TableCell>{result.email}</TableCell>
              <TableCell>{result.name}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    result.status
                  )}`}
                >
                  {result.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
