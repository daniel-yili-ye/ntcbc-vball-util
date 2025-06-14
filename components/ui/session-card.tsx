import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Input } from "./input";

export const SessionCard = ({
  session,
  handleFileUpload,
  sessionAdmins,
  setSessionAdmins,
  sessionCap,
  setSessionCap,
}: {
  session: number;
  handleFileUpload: (file: File, session: number) => void;
  sessionAdmins: number;
  setSessionAdmins: (value: number) => void;
  sessionCap: number;
  setSessionCap: (value: number) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Session {session} ({session === 1 ? "6:00" : "8:15"})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) =>
              e.target.files?.[0] &&
              handleFileUpload(e.target.files[0], session)
            }
          />
          <div className="flex gap-4">
            <div>
              <label className="text-sm">Number of Admins</label>
              <Input
                type="number"
                value={sessionAdmins}
                onChange={(e) => setSessionAdmins(Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <label className="text-sm">Session Cap</label>
              <Input
                type="number"
                value={sessionCap}
                onChange={(e) => setSessionCap(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
