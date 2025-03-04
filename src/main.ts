import * as core from '@actions/core'
import { wait } from './wait.js'
//import { context } from '@actions/github'
import { Octokit } from '@octokit/action'
/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  //const days: string = core.getInput('days')

  try {
    const octokit = new Octokit({
      auth: 'YOUR-TOKEN'
    })
    // created=2023-02-10..2023-02-12
    // created=>YYYY-MM-DD

    await octokit.request(
      'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs?created={createdQuery}&branch=main',
      {
        owner: 'OWNER',
        repo: 'REPO',
        workflow_id: 'WORKFLOW_ID',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )

    const ms: string = core.getInput('milliseconds')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
