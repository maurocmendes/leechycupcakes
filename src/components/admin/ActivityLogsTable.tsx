import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ActivityLogsTableProps {
  logs: any[];
}

export const ActivityLogsTable = ({ logs }: ActivityLogsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Ação</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Detalhes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs?.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              {new Date(log.created_at).toLocaleString()}
            </TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.entity_type}</TableCell>
            <TableCell>{log.entity_id}</TableCell>
            <TableCell>
              {log.details ? JSON.stringify(log.details) : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};