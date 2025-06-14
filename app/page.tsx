"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as duckdb from "@duckdb/duckdb-wasm";
import { SessionTable } from "@/components/ui/session-table";
import { SessionCard } from "@/components/ui/session-card";

interface SessionResult {
  session_id: string;
  ranking: number;
  priority_id: number;
  created_at: string;
  email: string;
  name: string;
  status: string;
}

export default function Home() {
  const [session1File, setSession1File] = useState<File | null>(null);
  const [session2File, setSession2File] = useState<File | null>(null);
  const [session1Admins, setSession1Admins] = useState<number>(2);
  const [session2Admins, setSession2Admins] = useState<number>(1);
  const [session1Cap, setSession1Cap] = useState<number>(21);
  const [session2Cap, setSession2Cap] = useState<number>(18);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (file: File, session: number) => {
    if (session === 1) {
      setSession1File(file);
    } else {
      setSession2File(file);
    }
  };

  const processData = async () => {
    if (!session1File || !session2File) {
      alert("Please upload both session files");
      return;
    }

    setIsLoading(true);
    try {
      // Initialize DuckDB WASM
      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
      const worker = await duckdb.createWorker(bundle.mainWorker!);
      const logger = new duckdb.ConsoleLogger();
      const db = new duckdb.AsyncDuckDB(logger, worker);
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

      const conn = await db.connect();

      // Read CSV files
      const session1Data = await session1File.text();
      const session2Data = await session2File.text();

      // Register CSV data as virtual files
      await db.registerFileText("session1.csv", session1Data);
      await db.registerFileText("session2.csv", session2Data);

      // Create tables from CSV files
      await conn.query(`
        CREATE TABLE session1 AS 
        SELECT * FROM read_csv_auto('session1.csv') 
        WHERE approval_status != 'declined';
      `);

      await conn.query(`
        CREATE TABLE session2 AS 
        SELECT * FROM read_csv_auto('session2.csv') 
        WHERE approval_status != 'declined';
      `);

      // Insert admin entries
      if (session1Admins > 0) {
        await conn.query(`
          INSERT INTO session1 (name, email, created_at, approval_status)
          SELECT 
            'Admin 600 ' || generate_series as name,
            'admin-600-' || generate_series || '@ntcbc.ca' as email,
            '2000-01-01T00:00:00.000Z' as created_at,
            'approved' as approval_status
          FROM generate_series(1, ${session1Admins});
        `);
      }

      if (session2Admins > 0) {
        await conn.query(`
          INSERT INTO session2 (name, email, created_at, approval_status)
          SELECT 
            'Admin 815 ' || generate_series as name,
            'admin-815-' || generate_series || '@ntcbc.ca' as email,
            '2000-01-01T00:00:00.000Z' as created_at,
            'approved' as approval_status
          FROM generate_series(1, ${session2Admins});
        `);
      }

      // Process rankings
      const query = `
        WITH sessions AS (
          SELECT '6:00' AS session_id, * FROM session1
          UNION ALL
          SELECT '8:15' AS session_id, * FROM session2
        ),
        sessions_with_priority AS (
          SELECT 
            ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as priority_id, 
            * 
          FROM sessions
        ),
        sessions_with_ranking AS (
          SELECT
            ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY priority_id, created_at, email ASC) as ranking,
            *
          FROM sessions_with_priority
          ORDER BY session_id, ranking
        )
        SELECT
          session_id,
          ranking,
          priority_id,
          created_at,
          email,
          name,
          CASE 
            WHEN session_id = '6:00' AND ranking <= ${session1Cap} THEN 'confirmed'
            WHEN session_id = '8:15' AND ranking <= ${session2Cap} THEN 'confirmed'
            ELSE 'waitlisted' 
          END as status
        FROM sessions_with_ranking
        ORDER BY session_id, ranking;
      `;

      const result = await conn.query(query);
      const resultData = result.toArray().map((row) => ({
        session_id: row.session_id,
        ranking: row.ranking,
        priority_id: row.priority_id,
        created_at: row.created_at,
        email: row.email,
        name: row.name,
        status: row.status,
      }));

      setResults(resultData);

      // Clean up
      await conn.close();
      await db.terminate();
      await worker.terminate();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process data: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = [
      "Session",
      "Ranking",
      "Priority ID",
      "Created At",
      "Email",
      "Name",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...results.map((row) =>
        [
          row.session_id,
          row.ranking,
          row.priority_id,
          new Date(row.created_at).toLocaleString(),
          row.email,
          row.name,
          row.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "volleyball_sessions_results.csv";
    link.click();
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Volleyball Session Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <SessionCard
          session={1}
          handleFileUpload={handleFileUpload}
          sessionAdmins={session1Admins}
          setSessionAdmins={setSession1Admins}
          sessionCap={session1Cap}
          setSessionCap={setSession1Cap}
        />

        <SessionCard
          session={2}
          handleFileUpload={handleFileUpload}
          sessionAdmins={session2Admins}
          setSessionAdmins={setSession2Admins}
          sessionCap={session2Cap}
          setSessionCap={setSession2Cap}
        />
      </div>

      <div className="flex gap-4 mb-4">
        <Button onClick={processData} disabled={isLoading}>
          {isLoading ? "Processing..." : "Process Data"}
        </Button>
        {results.length > 0 && (
          <Button onClick={exportToCSV} variant="outline">
            Export to CSV
          </Button>
        )}
      </div>

      {results.length > 0 && (
        <Tabs defaultValue="session1">
          <TabsList>
            <TabsTrigger value="session1">Session 1 (6:00)</TabsTrigger>
            <TabsTrigger value="session2">Session 2 (8:15)</TabsTrigger>
          </TabsList>
          <TabsContent value="session1">
            <SessionTable results={results} sessionId="6:00" />
          </TabsContent>
          <TabsContent value="session2">
            <SessionTable results={results} sessionId="8:15" />
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
