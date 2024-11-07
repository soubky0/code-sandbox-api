function normalizePythonError(errorOutput: string): string {
  return errorOutput
    .replace(
      /File ".*?", line \d+, in <module>/g,
      'File "<stdin>", line 1, in <module>',
    )
    .trim();
}

export async function runCommand(
  cmd: string,
): Promise<object> {
  const command = cmd.split(" ")[0];
  const args = cmd.split(" ").slice(1);
  const denoCommand = new Deno.Command(command, {
    args,
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout, stderr } = await denoCommand.output();

  if (code !== 0) {
    return { stderr: normalizePythonError(new TextDecoder().decode(stderr)) };
  }

  return { stdout: new TextDecoder().decode(stdout) };
}

export async function executePythonCode(code: string): Promise<object> {
  await Deno.writeTextFile("./main.py", code);
  return await runCommand("python3 main.py");
}
