# \# CLAUDE.md

# 

# Instructions for Claude Code in this repo. Read this and `PROJECT.md` before doing anything.

# 

# \## 1. Think Before Coding

# 

# Don't assume. Don't hide confusion. Surface tradeoffs.

# 

# Before implementing:

# 

# \* State assumptions explicitly when they matter.

# \* If multiple interpretations exist, present them instead of silently choosing one.

# \* If a simpler approach exists, say so.

# \* Push back when an approach is unnecessarily complex or risky.

# \* If something is genuinely unclear, stop and ask rather than guessing.

# 

# For anything beyond a trivial change, define what success means before implementing.

# 

# For multi-step tasks, use a brief plan:

# 

# 1\. \[Step] → verify: \[check]

# 2\. \[Step] → verify: \[check]

# 3\. \[Step] → verify: \[check]

# 

# Keep the plan short and readable. Show the plan, not a wall of code.

# 

# \## 2. Simplicity First

# 

# Write the minimum code that solves the problem.

# 

# \* No features beyond what was requested.

# \* No abstractions for single-use code.

# \* No speculative flexibility or configurability.

# \* No unnecessary dependencies.

# \* No error handling for impossible scenarios.

# \* Don't optimize prematurely.

# \* Prefer existing project patterns over introducing new ones.

# 

# Ask:

# 

# > Would a senior engineer say this is overcomplicated?

# 

# If yes, simplify it.

# 

# If a solution can be 50 lines instead of 200 without sacrificing correctness or clarity, use the simpler solution.

# 

# \## 3. Surgical Changes

# 

# Touch only what you must.

# 

# When editing existing code:

# 

# \* Don't improve unrelated code.

# \* Don't refactor code that isn't broken.

# \* Don't rewrite adjacent comments or formatting unnecessarily.

# \* Match the existing project style.

# \* Don't delete unrelated dead code unless asked.

# 

# Every changed line should have a clear connection to the user's request or be necessary for correctness.

# 

# When your changes create unused imports, variables, or functions, remove those orphans.

# 

# If you notice unrelated problems, mention them separately instead of fixing them automatically.

# 

# \## 4. Workflow

# 

# For anything beyond a one-line fix:

# 

# 1\. State briefly what you're going to do and why.

# 2\. Identify the relevant files.

# 3\. Explain any important assumptions or tradeoffs.

# 4\. Wait for explicit approval before making substantial changes.

# 

# Do not ask for approval for trivial tasks such as fixing a typo or running tests. Use judgment.

# 

# One thing at a time. Don't bundle unrelated fixes into a requested feature.

# 

# If something else is broken while working, mention it separately and ask whether to fix it now or later.

# 

# \## 5. Goal-Driven Execution

# 

# Turn requests into verifiable goals.

# 

# Examples:

# 

# \* "Add validation" → write tests for invalid inputs, then make them pass.

# \* "Fix the bug" → reproduce it with a test, then fix it.

# \* "Refactor X" → ensure tests pass before and after.

# 

# Don't stop at "the code looks right." Verify the actual behavior.

# 

# Continue until the defined success criteria are satisfied.

# 

# \## 6. Testing and Verification

# 

# Always run the relevant tests after making changes.

# 

# For engine changes, always run:

# 

# ```bash

# npm test

# ```

# 

# before saying the work is complete.

# 

# If a test fails:

# 

# \* Treat the failure as the report.

# \* Fix the implementation or explain why the test is now incorrect.

# \* Never modify a test simply to make it pass without explicitly saying so.

# 

# After editing a file, read it back and verify that the intended change actually landed.

# 

# Never rely on a text replacement silently succeeding. If using a replacement or automated edit, verify the resulting file.

# 

# \## 7. Commit Policy

# 

# Ask before committing substantial changes.

# 

# For small changes such as:

# 

# \* one-line fixes

# \* typos

# \* style tweaks

# \* passing test-only changes

# 

# a commit can be made without asking.

# 

# For larger changes, ask before committing, especially:

# 

# \* new features

# \* schema changes

# \* changes affecting payout logic

# \* changes affecting breach logic

# \* changes affecting phase logic

# \* anything that changes the simulation contract

# 

# When asking, be explicit:

# 

# > this changes X. commit?

# 

# Don't hide a large change inside a later unrelated commit.

# 

# \## 8. PropSim Boundaries

# 

# Do not touch:

# 

# ```text

# propsim/sql/SEED-\*.sql

# ```

# 

# without being explicitly asked.

# 

# These files encode specific firms' real published rules and are maintained through hand-checked work. They should not be casually regenerated or overwritten.

# 

# Do not add dependencies without asking first.

# 

# Do not change the rule schema in `engine.js` without updating `PROJECT.md` in the same commit.

# 

# If a change would affect the simulation contract, explicitly identify it before writing code.

# 

# This includes:

# 

# \* breach behavior

# \* payout behavior

# \* phase resets

# \* account state transitions

# \* rule interpretation

# 

# If the proposed change contradicts `PROJECT.md`, say so explicitly and identify the relevant section before implementing it.

# 

# \## 9. Response Style

# 

# Keep responses short and direct.

# 

# \* lowercase preferred

# \* no title case

# \* no unnecessary bullet-point walls

# \* no "Great question!"

# \* no "I'd be happy to!"

# \* no "Certainly!"

# \* no emoji

# \* no em dashes as a tic

# \* don't repeat information unnecessarily

# \* explain only what is relevant

# 

# When something is uncertain, say so plainly.

# 

# When you disagree with an approach, say so directly instead of silently complying.

# 

# For plans, prefer a short numbered list when there are multiple steps. Use inline text when the task is simple.

# 

# Show the plan before substantial implementation. Save the actual diff/code for after approval.

# 

# \## 10. General Principle

# 

# Optimize for:

# 

# \*\*correctness > simplicity > minimal changes > speed\*\*

# 

# The goal is not to write the most code. The goal is to make the requested change correctly, verify it, and avoid creating new problems.



