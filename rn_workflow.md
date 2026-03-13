# React Native Build & Deploy Workflow — v2 (Audit-Corrected)
## Complete 20-Phase Execution Document
### Revised: March 13, 2026 — All audit corrections from Toolchain Inspection Report applied

> **CHANGE LOG vs v1:**
> Node 24 LTS · pnpm 10.x supply chain hardening · Android API 35 + 16KB page compliance ·
> Expo SDK 55 / RN 0.83.1 / React 19.2 · New Architecture enforcement (Fabric/JSI, no Legacy) ·
> React Compiler (manual memo obsolete) · Expo Router v7 NativeTabs · Zustand v5 named exports + useShallow ·
> TanStack Query v5 (no onSuccess/onError on useQuery) · Zod v4 · sentry-expo → @sentry/react-native ·
> Supabase anon key schema deprecation · EAS CLI v18 + --environment flag · Detox 20.47.0 + macOS CI runner

---

## WORKFLOW MANIFEST

```
App Target     : Both (iOS + Android)
State Manager  : TanStack Query v5 (server state) + Zustand v5 (client/UI state)
Backend Type   : Supabase (supabase-js 2.99.x)
Auth Strategy  : JWT via Supabase Auth
Deploy Target  : Public App Stores — iOS App Store + Google Play
RN Mode        : Expo Managed Workflow — SDK 55
React Native   : 0.83.1
React          : 19.2.0
App Name       : {{APP_NAME: the name of your application}}
Bundle ID (iOS): {{BUNDLE_ID_IOS: e.g. com.company.appname}}
Package (And.) : {{PACKAGE_NAME_ANDROID: e.g. com.company.appname}}
Supabase URL   : {{SUPABASE_URL: from Supabase project settings}}
Supabase Anon  : {{SUPABASE_ANON_KEY: from Supabase project settings}}
EAS Account    : {{EAS_ACCOUNT: your Expo account slug}}
```

### ⚠ Machine-Level Constraint (ESTABLISHED)

**Host OS: Linux (Debian/Ubuntu-based dual-boot on HP 14-ep1xxx)**
- Xcode is **unavailable**. All iOS compilation is delegated to **EAS Build (cloud)**.
- iOS simulator is **unavailable** on Linux. Use **Expo Go on a physical iOS device** for
  pre-EAS development, then EAS builds for TestFlight/App Store validation.
- iOS E2E (Detox) is **unavailable locally**. iOS E2E must run on macOS GitHub Actions runners.
- Android local builds are possible. Prefer a **physical Android device** over the emulator
  given 12 GiB RAM constraint.

### ⚠ New Architecture Constraint (ESTABLISHED)

**Expo SDK 55 removes the Legacy Architecture entirely.** The `newArchEnabled` flag is gone.
Fabric renderer and JSI are the sole operational reality. Every third-party native module
must be New Architecture-compatible before project initialization. Audit all deps in Phase 4
before writing a single line of feature code.

---

### Phase Dependency Graph (ASCII DAG)

```
[1: Env Setup]
      │
      ▼
[2: Project Init (SDK 55)]
      │
      ▼
[3: Dir & Architecture]
      │
      ▼
[4: Dependency Mgmt] ◄──────────────────────────────────────┐
      │                                                       │
      ▼                                                       │
[5: Config & Env Vars]                                        │
      │                                                       │
      ▼                                                       │
[6: Navigation (Expo Router v7 + NativeTabs)]                 │
      │                                                       │
      ▼                                                       │
[7: State Mgmt (TanStack v5 + Zustand v5)]                   │
      │                                                       │
      ▼                                                       │
[8: Component & Screen Dev] ◄──────────────────────────┐    │
      │                                                  │    │
      ▼                                                  │    │
[9: Business Logic & Service Layer]                      │    │
      │                                                  │    │
      ▼                                                  │    │
[10: API Integration (Supabase)]                         │    │
      │                                                  │    │
      ▼                                                  │    │
[11: Local Storage & Persistence]                        │    │
      │                                                  │    │
      ▼                                                  │    │
[12: Testing (Unit → Integration → E2E)]─────────────────┘    │
      │                                                        │
      ▼                                                        │
[13: Performance Optimization]────────────────────────────────┘
      │
      ▼
[14: Accessibility & i18n]
      │
      ▼
[15: Security Hardening]
      │
      ▼
[16: Build Config (API 35 + 16KB + EAS CLI v18)]
      │
      ▼
[17: CI/CD (pnpm + macOS runner for iOS E2E)]
      │
      ▼
[18: Pre-release QA & Beta Distribution]
      │
      ▼
[19: App Store Submission]
      │
      ▼
[20: Post-deployment Monitoring (@sentry/react-native)]

Feedback paths: 12→8, 13→4, 18→16, 19→18, 20→any
```

---

## PHASE 1: Environment Setup

**Goal:** Establish a fully verified, reproducible development environment on Linux using Node.js 24 LTS, pnpm 10.x (with supply chain hardening), JDK 17, Android SDK API 35, NDK r28, and EAS CLI v18.

**Precondition:** Fresh or existing Linux install with internet access, `sudo` privileges, and `bash` or `zsh` shell available.

---

```
1.1. [VERIFY] Confirm Linux kernel and distro version
     → Input    : Running Linux system
     → Output   : Confirmed OS string
     → Tool/Cmd : `uname -a && cat /etc/os-release`
     → Fail Mode: Unsupported distro — verify package manager (apt/dnf/pacman);
                  this workflow assumes apt.

1.2. [INSTALL] Install Node.js 24 LTS via nvm v0.40.4
     → Input    : Internet access, bash/zsh
     → Output   : nvm v0.40.4 installed; Node.js 24 LTS active
     → Tool/Cmd : `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash`
                  `source ~/.bashrc`   # or ~/.zshrc
                  `nvm install 24`
                  `nvm alias default 24`
                  `node -v`            # must print v24.x.x
                  `npm -v`
     → Fail Mode: nvm not found after source — add the nvm init stanza to shell rc manually.
                  v0.39.x already installed — uninstall first or run install script;
                  it upgrades in place.
     → NOTE: v0.40.4 introduces enhanced POSIX compliance and correct corepack binary
             handling absent from v0.39.x. Do not pin to the older version.

1.3. [INSTALL] Install pnpm v10.x and configure supply chain hardening
     → Input    : Node.js 24 active
     → Output   : pnpm ≥ 10.32.0 available; .npmrc with allowBuilds configured
     → Tool/Cmd : `npm install -g pnpm@latest`
                  `pnpm -v`            # must print 10.x.x
                  Create `.npmrc` at future project root (prepare now for reference):
                  ```
                  engine-strict=true
                  # Explicitly allow only known packages to run install scripts.
                  # Populate {{PACKAGE_NAMES}} after Phase 4 dependency audit.
                  # Example: allowBuilds[]=@sentry/react-native
                  # allowBuilds[]=hermes-engine
                  ```
     → Fail Mode: Permission error — with nvm active, global installs must not need sudo.
                  If sudo is required, nvm is not loaded; re-run `source ~/.bashrc`.
     → NOTE: pnpm 10.26+ blocks git-hosted dependencies from running prepare scripts by
             default and enforces integrity hashes on HTTP tarballs. The allowBuilds
             setting replaces the deprecated onlyBuiltDependencies parameter. Populate it
             after Phase 4 to avoid blocking legitimate post-install build scripts.

1.4. [INSTALL] Install EAS CLI v18 and Expo CLI globally
     → Input    : Node.js 24 + pnpm active
     → Output   : `eas` (≥18.1.0) and `expo` commands available
     → Tool/Cmd : `npm install -g eas-cli@latest expo-cli`
                  `eas --version`      # must print 18.x.x
                  `expo --version`
     → Fail Mode: Version mismatch with local project — use `npx eas` and `npx expo`
                  as runtime fallbacks without touching the global install.

1.5. [INSTALL] Install JDK 17 for Android Gradle tooling
     → Input    : apt package manager available
     → Output   : JDK 17 installed and set as JAVA_HOME
     → Tool/Cmd : `sudo apt update && sudo apt install -y openjdk-17-jdk`
                  `java -version`      # must print openjdk 17
     → Fail Mode: Wrong version active — force JAVA_HOME:
                  `export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64`
                  Add to ~/.bashrc. Do NOT use JDK 21 as primary Gradle compiler;
                  legacy third-party native modules produce jvm target incompatibility
                  errors during :app:compileDebugJavaWithJavac.

1.6. [INSTALL] Install Android Studio with API 35 SDK, Build Tools 35.x, and NDK r28
     → Input    : ~10 GB disk space available (Linux root partition: 165 GB confirmed)
     → Output   : Android Studio installed; API 35 SDK, Build Tools 35.x, NDK r28 present
     → Tool/Cmd : Download from https://developer.android.com/studio
                  Extract to ~/android-studio
                  `sudo apt install -y libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1`
                  Launch: `~/android-studio/bin/studio.sh`
                  Via SDK Manager → SDK Platforms:
                    ✓ Android 15 (API 35) — install SDK Platform + Google APIs
                  Via SDK Manager → SDK Tools:
                    ✓ Android SDK Build-Tools 35.x
                    ✓ NDK (Side by side) → select r28 specifically
                    ✓ CMake (latest)
     → Fail Mode: Missing 32-bit libs — install via apt as above.
                  Emulator slow on 12 GiB RAM — use physical Android device (preferred).
     → CRITICAL: NDK r28 is mandatory for 16KB memory page size support. NDK r26 and
                 earlier produce 4KB-aligned .so binaries that Android 15 hardware with
                 16KB pages will refuse to load with a fatal UnsatisfiedLinkError.

1.7. [CONFIGURE] Set Android and NDK environment variables
     → Input    : Android SDK + NDK installed
     → Output   : ANDROID_HOME, ANDROID_NDK_HOME, PATH updated
     → Tool/Cmd : Add to ~/.bashrc:
                  ```
                  export ANDROID_HOME=$HOME/Android/Sdk
                  export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/28.x.x   # replace with exact r28 version string
                  export PATH=$PATH:$ANDROID_HOME/emulator
                  export PATH=$PATH:$ANDROID_HOME/platform-tools
                  ```
                  `source ~/.bashrc`
                  `adb --version`
                  `ls $ANDROID_NDK_HOME/toolchains`   # verify r28 present
     → Fail Mode: adb not found — verify SDK path with `ls $ANDROID_HOME`.
                  NDK path contains wrong version — check exact dir name in
                  `ls $ANDROID_HOME/ndk/`.

1.8. [CONFIGURE] Connect physical Android device (API 15+ recommended for dev)
     → Input    : Android device with USB debugging enabled
     → Output   : Device visible to adb
     → Tool/Cmd : Enable USB debugging on device (Settings → Developer Options)
                  `adb devices`        # device must show as "device", not "unauthorized"
     → Fail Mode: "unauthorized" — accept RSA prompt on device screen.
                  Device not listed — try different USB cable; check `dmesg | tail`.

1.9. [LOGIN] Authenticate with EAS account
     → Input    : Expo account credentials (create at expo.dev if needed)
     → Output   : Logged-in session on this machine
     → Tool/Cmd : `eas login`
                  `eas whoami`
     → Fail Mode: Login fails — check network; corporate firewall may block expo.dev.

1.10. [VERIFY] Confirm complete toolchain
      → Input    : All tools installed
      → Output   : Clean version report matching mandated targets
      → Tool/Cmd : `node -v && pnpm -v && eas --version && java -version && adb --version`
                   Expected: Node v24.x · pnpm 10.x · eas 18.x · java 17 · adb present
      → Fail Mode: Any mismatch — revisit the corresponding install step.
```

**Postcondition:** Node.js 24 LTS, pnpm 10.x, EAS CLI v18, JDK 17, Android SDK API 35, NDK r28, and adb all verified operational. EAS account authenticated.

**Feedback Gate:** BACK → PHASE 1 if any Phase 2 scaffold command fails due to missing or mismatched CLI tools.

---

## PHASE 2: Project Initialization

**Goal:** Scaffold a new Expo SDK 55 project, which brings React Native 0.83.1, React 19.2.0, and the mandatory New Architecture by default.

**Precondition:** Phase 1 complete. Git installed. Remote repo created (empty).

---

```
2.1. [SCAFFOLD] Create new Expo SDK 55 project from blank TypeScript template
     → Input    : {{APP_NAME}}, working directory of choice
     → Output   : Project directory with Expo SDK 55 structure
     → Tool/Cmd : `npx create-expo-app@latest {{APP_NAME}} --template blank-typescript`
                  `cd {{APP_NAME}}`
                  `cat package.json | grep '"expo"'`   # verify SDK 55 in version string
     → Fail Mode: Template fetches an older SDK — explicitly pin:
                  `npx create-expo-app@latest {{APP_NAME}} --template blank-typescript`
                  then `npx expo install expo@^55.0.0` to force SDK 55.
     → NOTE: SDK 55 includes React 19.2.0 and RN 0.83.1. The React Compiler is active
             by default. The Legacy Architecture is absent — newArchEnabled no longer
             exists as a configurable flag.

2.2. [AUDIT] Verify New Architecture compatibility of all planned native dependencies
     → Input    : Planned third-party native module list (from Phase 4 planning)
     → Output   : Confirmed-compatible list; incompatible modules identified before install
     → Tool/Cmd : For each planned native module, check:
                  https://reactnative.directory/ — filter "New Architecture" support
                  `npx react-native-compatibility-check` (if available)
     → Fail Mode: A required module is not New Architecture-compatible — evaluate:
                  (a) find an actively maintained fork, (b) use an Expo Module alternative,
                  (c) write a custom Expo Module, (d) remove the requirement.
                  Do NOT proceed to Phase 4 with a known incompatible module.

2.3. [CONFIGURE] Set app identity in app.json
     → Input    : app.json from scaffold
     → Output   : Correct identity fields
     → Tool/Cmd : Edit `app.json`:
                  `"name": "{{APP_NAME}}"`
                  `"slug": "{{APP_NAME_SLUG}}"`
                  `"version": "1.0.0"`
                  `"scheme": "{{APP_SCHEME}}"`
                  `"orientation": "portrait"`
                  `"ios": { "bundleIdentifier": "{{BUNDLE_ID_IOS}}" }`
                  `"android": { "package": "{{PACKAGE_NAME_ANDROID}}" }`
     → Fail Mode: Invalid slug (spaces/uppercase) breaks EAS — use lowercase-hyphenated only.
                  CRITICAL: Bundle ID and package name cannot be changed after first
                  store submission without creating a new app listing.

2.4. [INIT] Link project to EAS
     → Input    : EAS session active (Phase 1.9), app.json configured
     → Output   : eas.json created; project linked to EAS dashboard
     → Tool/Cmd : `eas init`
                  `cat eas.json`
     → Fail Mode: "Project not found" — ensure `eas login` session is active.

2.5. [INIT] Initialize Git and make first commit
     → Input    : Scaffolded project directory
     → Output   : Git repo with initial commit on main
     → Tool/Cmd : `git init`
                  `git add .`
                  `git commit -m "chore: initial Expo SDK 55 project scaffold"`
                  `git remote add origin {{REMOTE_REPO_URL}}`
                  `git branch -M main`
                  `git push -u origin main`
     → Fail Mode: Auth failure — configure SSH key or HTTPS credential helper.

2.6. [VERIFY] Confirm dev server starts and app runs on physical Android device
     → Input    : Android device connected (adb devices shows "device")
     → Output   : Metro bundler running; app renders on device
     → Tool/Cmd : `npx expo start --clear`
                  Press `a` to open on connected Android device.
                  For iOS: scan QR with Expo Go on physical iOS device.
     → Fail Mode: Metro fails on port 8081 — `lsof -i :8081` and kill conflict.
                  iOS device can't connect — use `--tunnel` flag.
```

**Postcondition:** SDK 55 project scaffolded, EAS-linked, version-controlled, and confirmed running on at least one physical device. New Architecture active with no override possible.

**Feedback Gate:** BACK → PHASE 1 if `eas init` or `npx expo start` fail due to CLI version mismatches.

---

## PHASE 3: Directory & Architecture Design

**Goal:** Establish a scalable, consistent directory structure and module boundaries before any feature code is written.

**Precondition:** Phase 2 complete. Project compiles and runs.

---

```
3.1. [CREATE] Establish top-level source directory structure
     → Input    : Empty project root
     → Output   : Directory tree created
     → Tool/Cmd : `mkdir -p src/{app,components,screens,navigation,hooks,store,services,lib,types,utils,assets,i18n,constants}`
     → Fail Mode: Naming conflicts with Expo Router conventions — src/app/ IS the router root;
                  adjust if using non-router navigation pattern.

3.2. [CREATE] Document module boundaries in ARCHITECTURE.md
     → Input    : Architecture decision
     → Output   : ARCHITECTURE.md at project root
     → Tool/Cmd : Create `ARCHITECTURE.md` with the following module map:
                  src/app/          — Expo Router v7 file-based routes
                  src/components/   — Reusable, stateless UI primitives
                  src/hooks/        — Custom hooks (TanStack Query hooks live here)
                  src/store/        — Zustand v5 stores
                  src/services/     — Supabase client + API abstraction layer
                  src/lib/          — Library config (queryClient, persister, metro)
                  src/types/        — TypeScript interfaces + Supabase-generated types
                  src/utils/        — Pure utility functions (no side effects)
                  src/constants/    — App-wide constants (colors, config keys)
                  src/i18n/         — i18next locale files and config
                  src/assets/       — Images, fonts, icons
     → Fail Mode: No hard failure; lack of conventions causes drift at scale.

3.3. [CREATE] Add TypeScript path aliases
     → Input    : tsconfig.json from scaffold
     → Output   : `@/` alias resolves to `src/`
     → Tool/Cmd : Edit `tsconfig.json`:
                  ```json
                  {
                    "extends": "expo/tsconfig.base",
                    "compilerOptions": {
                      "strict": true,
                      "baseUrl": ".",
                      "paths": { "@/*": ["src/*"] }
                    }
                  }
                  ```
                  `pnpm add -D babel-plugin-module-resolver`
                  Edit `babel.config.js`:
                  ```js
                  module.exports = function(api) {
                    api.cache(true);
                    return {
                      presets: ['babel-preset-expo'],
                      plugins: [
                        ['module-resolver', { root: ['./src'], alias: { '@': './src' } }]
                      ]
                    };
                  };
                  ```
     → Fail Mode: Alias not resolving at runtime — clear Metro cache:
                  `npx expo start --clear`.

3.4. [COMMIT] Commit directory structure and config
     → Input    : All changes from 3.1–3.3
     → Output   : Git commit
     → Tool/Cmd : `git add . && git commit -m "chore: directory structure and TS path aliases"`
     → Fail Mode: None beyond standard git issues.
```

**Postcondition:** Directory tree exists, module responsibilities documented, TypeScript aliases resolve, Metro starts cleanly.

**Feedback Gate:** BACK → PHASE 3 if Phase 6 (Navigation) reveals that Expo Router v7 requires restructuring the `src/app/` directory.

---

## PHASE 4: Dependency Management

**Goal:** Install, pin, and audit all project dependencies with New Architecture compliance verified for every native module, and pnpm 10.x allowBuilds populated.

**Precondition:** Phase 3 complete. `package.json` exists.

---

```
4.1. [VERIFY] Confirm Expo SDK 55 core deps are present and correct
     → Input    : package.json from scaffold
     → Output   : expo@^55, react@19.2.x, react-native@0.83.x confirmed
     → Tool/Cmd : `cat package.json | grep -E '"expo"|"react"|"react-native"'`
                  `pnpm install`       # generate lockfile
     → Fail Mode: Peer conflict — `pnpm install --no-strict-peer-dependencies`
                  as temporary measure; resolve root cause before Phase 16.

4.2. [INSTALL] Expo Router v7 and safe area / screens peers
     → Input    : Project root
     → Output   : expo-router@^7 installed with SDK 55-compatible peers
     → Tool/Cmd : `npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar`
     → Fail Mode: Version pulled is not v7 — check
                  https://docs.expo.dev/router/installation/ for SDK 55-matched versions.
     → NOTE: expo-router v7 ships the Native Tabs API and Native Stack Toolbar.
             These require New Architecture — confirmed present in SDK 55.

4.3. [INSTALL] Supabase client and polyfill (conditional)
     → Input    : Project root
     → Output   : @supabase/supabase-js@^2.99.x + AsyncStorage installed
     → Tool/Cmd : `pnpm add @supabase/supabase-js`
                  `npx expo install @react-native-async-storage/async-storage`
                  `pnpm add react-native-url-polyfill`
     → Fail Mode: AsyncStorage missing causes silent Supabase Auth session persistence failure.
     → NOTE: With Hermes on RN 0.83, the URL polyfill may be redundant. Retain it for now
             as a safe default. After Phase 9 integration testing, validate that removing
             it causes no auth URL parsing failures on your target devices. Remove in
             Phase 13 if tests pass, eliminating one supply chain vector.

4.4. [INSTALL] TanStack Query v5
     → Input    : Project root
     → Output   : @tanstack/react-query@^5.90.x installed
     → Tool/Cmd : `pnpm add @tanstack/react-query`
                  `pnpm add -D @tanstack/eslint-plugin-query`
                  `cat node_modules/@tanstack/react-query/package.json | grep '"version"'`
                  # must print 5.x.x
     → Fail Mode: v4 pulled — explicitly pin: `pnpm add @tanstack/react-query@^5`.

4.5. [INSTALL] Zustand v5
     → Input    : Project root
     → Output   : zustand@^5.0.11 installed
     → Tool/Cmd : `pnpm add zustand@^5`
                  `cat node_modules/zustand/package.json | grep '"version"'`
                  # must print 5.x.x
     → Fail Mode: v4 pulled — pin explicitly. v5 ships its own types; no @types/zustand needed.
     → NOTE: Zustand v5 removes default exports entirely. All imports must use named exports.
             useStore(selector, shallow) is deprecated; use useShallow from zustand/react/shallow.
             React 18 is the minimum; SDK 55 ships React 19.2 — compatible.

4.6. [INSTALL] Development tooling — ESLint, Prettier, TypeScript
     → Input    : Project root
     → Output   : Linting and formatting toolchain active
     → Tool/Cmd : `pnpm add -D eslint prettier eslint-config-expo eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser`
                  Create `.eslintrc.js`:
                  ```js
                  module.exports = {
                    extends: ['expo', 'prettier'],
                    plugins: ['prettier', '@tanstack/query'],
                    rules: { 'prettier/prettier': 'error' }
                  };
                  ```
                  Create `.prettierrc`:
                  ```json
                  { "semi": true, "singleQuote": true, "printWidth": 100 }
                  ```
     → Fail Mode: Rule collisions — `npx eslint --print-config src/app/_layout.tsx` to diagnose.

4.7. [INSTALL] Zod v4 for input validation
     → Input    : Project root
     → Output   : zod@^4 installed
     → Tool/Cmd : `pnpm add zod@^4`
     → Fail Mode: v3 pulled — pin explicitly with `@^4`. v4 schema syntax remains
                  compatible with v3 for basic use cases; more complex transforms
                  may require adjustments in Phase 15.
     → NOTE: Zod v4 rewrites the internal AST parser — up to 14x faster string parsing
             and smaller memory footprint. Application passively inherits these gains.

4.8. [INSTALL] Testing dependencies
     → Input    : Project root
     → Output   : Jest, Testing Library, Detox 20.47.0 installed
     → Tool/Cmd : `pnpm add -D jest jest-expo @testing-library/react-native @testing-library/jest-native`
                  `pnpm add -D detox@^20.47.0 detox-cli`
                  Add to package.json:
                  ```json
                  "jest": {
                    "preset": "jest-expo",
                    "setupFilesAfterFramework": ["@testing-library/jest-native/extend-expect"]
                  }
                  ```
     → Fail Mode: Detox requires separate native setup in Phase 12. Install now, configure later.

4.9. [CONFIGURE] Populate .npmrc allowBuilds after all deps installed
     → Input    : Full node_modules tree
     → Output   : .npmrc with explicit allow-list for post-install scripts
     → Tool/Cmd : Audit which packages run install scripts:
                  `pnpm why hermes-engine`
                  Review the list; for each legitimate build script package, add to .npmrc:
                  ```
                  allowBuilds[]=hermes-engine
                  allowBuilds[]=@sentry/react-native
                  allowBuilds[]=react-native
                  # add any others identified
                  ```
     → Fail Mode: Over-permissive allowBuilds — do not use wildcard patterns; list
                  each package explicitly.

4.10. [AUDIT] Run dependency audit
      → Input    : Installed node_modules
      → Output   : Zero critical vulnerabilities; documented exceptions for moderate
      → Tool/Cmd : `pnpm audit`
                   `pnpm audit --fix` for auto-fixable issues
      → Fail Mode: Unfixable critical vuln in transitive dep — document in SECURITY.md
                   with planned resolution timeline.

4.11. [LOCK] Commit lockfile
      → Input    : All dependencies installed
      → Output   : pnpm-lock.yaml committed
      → Tool/Cmd : `git add package.json pnpm-lock.yaml .npmrc && git commit -m "chore: pin all dependencies with pnpm 10.x supply chain config"`
      → Fail Mode: Lockfile not generated — ensure pnpm (not npm/yarn) is used consistently.
```

**Postcondition:** All deps installed, New Architecture-compatible, audited, and locked. pnpm 10.x allowBuilds populated. No unresolved peer conflicts.

**Feedback Gate:** BACK → PHASE 4 if any later phase reveals a missing or incompatible dependency.

---

## PHASE 5: Configuration & Environment Variables

**Goal:** Establish a secure, environment-aware configuration system that keeps secrets out of version control and provides typed access to all config values.

**Precondition:** Phase 4 complete. Expo SDK 55 (SDK 49+ supports `process.env` with `EXPO_PUBLIC_` prefix).

---

```
5.1. [CREATE] Create .env files for each environment
     → Input    : Supabase credentials from https://app.supabase.com → Settings → API
     → Output   : .env.local (gitignored), .env.example (committed, no secrets)
     → Tool/Cmd : Create `.env.local`:
                  ```
                  EXPO_PUBLIC_SUPABASE_URL={{SUPABASE_URL}}
                  EXPO_PUBLIC_SUPABASE_ANON_KEY={{SUPABASE_ANON_KEY}}
                  EXPO_PUBLIC_API_ENV=development
                  ```
                  EXPO_PUBLIC_ prefix is REQUIRED for Expo to expose vars to the JS bundle.
                  Variables without this prefix are server-side only (invisible to client).
     → Fail Mode: Missing prefix — var is undefined at runtime with no error thrown.

5.2. [GITIGNORE] Exclude secret files from version control
     → Input    : .gitignore
     → Output   : .env.local and all *.env files excluded
     → Tool/Cmd : Add to .gitignore:
                  ```
                  .env.local
                  .env.*.local
                  *.env
                  google-play-service-account.json
                  ```
                  `git check-ignore -v .env.local`
     → Fail Mode: File already tracked — `git rm --cached .env.local`.

5.3. [CREATE] Typed config accessor module
     → Input    : Environment variable keys
     → Output   : src/constants/config.ts
     → Tool/Cmd : Create `src/constants/config.ts`:
                  ```ts
                  const required = (key: string): string => {
                    const val = process.env[key];
                    if (!val) throw new Error(`Missing required env var: ${key}`);
                    return val;
                  };

                  export const Config = {
                    supabaseUrl: required('EXPO_PUBLIC_SUPABASE_URL'),
                    supabaseAnonKey: required('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
                    apiEnv: process.env.EXPO_PUBLIC_API_ENV ?? 'development',
                  } as const;
                  ```
     → Fail Mode: process.env undefined — verify SDK 55 (inherits SDK 49+ behavior).

5.4. [CONFIGURE] Store secrets in EAS for CI builds
     → Input    : Supabase credentials, authenticated EAS session
     → Output   : Secrets stored in EAS, not in repo
     → Tool/Cmd : `eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value {{SUPABASE_URL}}`
                  `eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value {{SUPABASE_ANON_KEY}}`
                  `eas secret:list`
     → Fail Mode: Secret name doesn't exactly match env var name — undefined at runtime.

5.5. [COMMIT] Commit config module and example env
     → Input    : src/constants/config.ts, .env.example (placeholder values only)
     → Output   : Git commit
     → Tool/Cmd : `git add src/constants/config.ts .env.example .gitignore`
                  `git commit -m "chore: environment variable configuration"`
     → Fail Mode: Real secret committed — rotate Supabase anon key immediately in dashboard.
                  Git history rewrite is insufficient; treat as compromised.
```

**Postcondition:** Env vars are typed, validated at startup, gitignored, and stored in EAS for CI.

**Feedback Gate:** BACK → PHASE 5 if Phase 10 (API Integration) reveals additional required env vars.

---

## PHASE 6: Navigation Architecture

**Goal:** Implement complete navigation using Expo Router v7, including the Native Tabs API (`<NativeTabs>`) for authentic platform-native tab rendering on both iOS and Android.

**Precondition:** Phase 5 complete. `expo-router@^7` and peers installed (Phase 4.2).

---

```
6.1. [CONFIGURE] Set Expo Router v7 as entry point
     → Input    : package.json
     → Output   : "main" field points to expo-router entry
     → Tool/Cmd : In package.json:
                  `"main": "expo-router/entry"`
                  In app.json:
                  `"scheme": "{{APP_SCHEME}}"`
                  `"web": { "bundler": "metro" }`
     → Fail Mode: Old "main": "node_modules/expo/AppEntry.js" conflicts — remove it.

6.2. [CREATE] Establish file-based route structure
     → Input    : src/app/ directory (Phase 3.1)
     → Output   : Route files matching desired navigation graph
     → Tool/Cmd : Create:
                  `src/app/_layout.tsx`          — Root layout (all providers here)
                  `src/app/index.tsx`             — Entry redirect (to tabs or auth)
                  `src/app/(auth)/_layout.tsx`    — Auth group layout
                  `src/app/(auth)/login.tsx`      — Login screen
                  `src/app/(auth)/register.tsx`   — Registration screen
                  `src/app/(tabs)/_layout.tsx`    — Native tab navigator
                  `src/app/(tabs)/index.tsx`      — Home tab
                  `src/app/(tabs)/profile.tsx`    — Profile tab
                  `src/app/+not-found.tsx`        — 404 fallback
     → Fail Mode: Uppercase file names break routing on case-sensitive Linux filesystems —
                  use only lowercase-hyphenated file names.

6.3. [IMPLEMENT] Root layout — mount all providers
     → Input    : src/app/_layout.tsx
     → Output   : QueryClientProvider + SafeAreaProvider at root; i18n initialized
     → Tool/Cmd : Edit `src/app/_layout.tsx`:
                  ```tsx
                  import { Stack } from 'expo-router';
                  import { QueryClientProvider } from '@tanstack/react-query';
                  import { queryClient } from '@/lib/queryClient';
                  import { SafeAreaProvider } from 'react-native-safe-area-context';

                  export default function RootLayout() {
                    return (
                      <SafeAreaProvider>
                        <QueryClientProvider client={queryClient}>
                          <Stack screenOptions={{ headerShown: false }} />
                        </QueryClientProvider>
                      </SafeAreaProvider>
                    );
                  }
                  ```
     → Fail Mode: queryClient not yet created — stub import is acceptable here;
                  implement fully in Phase 7.

6.4. [IMPLEMENT] Auth-gated redirect logic in root index
     → Input    : Supabase session state
     → Output   : User routed to (auth) or (tabs) based on JWT session
     → Tool/Cmd : Edit `src/app/index.tsx`:
                  ```tsx
                  import { Redirect } from 'expo-router';
                  import { useSession } from '@/hooks/useSession';

                  export default function Index() {
                    const { session, loading } = useSession();
                    if (loading) return null;   // renders splash; MUST NOT redirect
                    return <Redirect href={session ? '/(tabs)' : '/(auth)/login'} />;
                  }
                  ```
     → Fail Mode: Redirect loop if session state is indeterminate — the null return
                  is the guard; never replace it with a redirect during loading.

6.5. [IMPLEMENT] Native tab navigator layout using NativeTabs API [EXPO ROUTER v7]
     → Input    : src/app/(tabs)/_layout.tsx
     → Output   : Tab bar rendered by host platform's native tab component
     → Tool/Cmd : Edit `src/app/(tabs)/_layout.tsx`:
                  ```tsx
                  import { NativeTabs, NativeTabsContent } from 'expo-router/unstable-native-tabs';

                  export default function TabLayout() {
                    return (
                      <NativeTabs>
                        <NativeTabsContent name="index" title="Home" />
                        <NativeTabsContent name="profile" title="Profile" />
                      </NativeTabs>
                    );
                  }
                  ```
     → Fail Mode: NativeTabs not found — verify expo-router v7 is installed, not v3/v4.
                  API is marked unstable (alpha) — import from unstable-native-tabs path.
     → NOTE: NativeTabs uses UITabBar (iOS) and BottomNavigationView (Android), not JS
             simulation. On iOS this provides the "liquid glass" translucency and system blur
             behaviors automatically. Safe areas, keyboard avoidance, and system visual
             effects are handled by the native layer without additional configuration.
             Production readiness: alpha as of SDK 55; evaluate community stability
             reports for your release timeline. Fallback: standard <Tabs> from expo-router
             remains available and New Architecture-compatible if stability is a concern.

6.6. [VERIFY] Confirm navigation tree renders on physical devices
     → Input    : Connected Android device + Expo Go on iOS device
     → Output   : All route groups render; native tab bar visible on both platforms
     → Tool/Cmd : `npx expo start --clear`
                  Navigate manually through all defined routes.
     → Fail Mode: "Unmatched route" — verify file names and directory structure against
                  Expo Router v7 docs; ensure _layout.tsx exists in every group.

6.7. [COMMIT] Commit navigation structure
     → Input    : All navigation files
     → Output   : Git commit
     → Tool/Cmd : `git add src/app/ && git commit -m "feat: Expo Router v7 navigation with NativeTabs API"`
     → Fail Mode: None beyond standard git issues.
```

**Postcondition:** Full navigation tree operational with auth-gated routing. NativeTabs rendering natively on both platforms. All routes render without errors.

**Feedback Gate:** BACK → PHASE 3 if directory structure conflicts with Expo Router v7 conventions.

---

## PHASE 7: State Management Setup

**Goal:** Configure TanStack Query v5 for server state and Zustand v5 for client/UI state, observing all v5 breaking changes in both libraries.

**Precondition:** Phase 6 complete. `@tanstack/react-query@^5` and `zustand@^5` installed.

---

```
7.1. [CREATE] Initialize QueryClient with production-appropriate defaults (TanStack v5)
     → Input    : @tanstack/react-query v5 installed
     → Output   : src/lib/queryClient.ts
     → Tool/Cmd : Create `src/lib/queryClient.ts`:
                  ```ts
                  import { QueryClient } from '@tanstack/react-query';

                  export const queryClient = new QueryClient({
                    defaultOptions: {
                      queries: {
                        staleTime: 1000 * 60 * 5,      // 5 minutes
                        gcTime: 1000 * 60 * 10,         // 10 minutes (v5: gcTime, NOT cacheTime)
                        retry: 2,
                        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
                        refetchOnWindowFocus: false,
                      },
                      mutations: {
                        retry: 0,
                      },
                    },
                  });
                  ```
     → Fail Mode: Using cacheTime — renamed to gcTime in v5; cacheTime will silently
                  have no effect. No TypeScript error will surface this.

7.2. [CREATE] Zustand v5 auth store — using named exports
     → Input    : Auth state requirements
     → Output   : src/store/authStore.ts
     → Tool/Cmd : Create `src/store/authStore.ts`:
                  ```ts
                  import { create } from 'zustand';  // named import — v5 removes default export
                  import { Session } from '@supabase/supabase-js';

                  interface AuthState {
                    session: Session | null;
                    isLoading: boolean;
                    setSession: (session: Session | null) => void;
                    setLoading: (loading: boolean) => void;
                  }

                  export const useAuthStore = create<AuthState>((set) => ({
                    session: null,
                    isLoading: true,
                    setSession: (session) => set({ session }),
                    setLoading: (isLoading) => set({ isLoading }),
                  }));
                  ```
     → Fail Mode: `import zustand from 'zustand'` (default import) — throws at runtime
                  in v5. Always use `import { create } from 'zustand'`.

7.3. [CREATE] Zustand v5 UI store — with useShallow for derived selectors
     → Input    : UI state requirements
     → Output   : src/store/uiStore.ts
     → Tool/Cmd : Create `src/store/uiStore.ts`:
                  ```ts
                  import { create } from 'zustand';

                  interface UIState {
                    toastMessage: string | null;
                    showToast: (message: string) => void;
                    clearToast: () => void;
                  }

                  export const useUIStore = create<UIState>((set) => ({
                    toastMessage: null,
                    showToast: (message) => set({ toastMessage: message }),
                    clearToast: () => set({ toastMessage: null }),
                  }));
                  ```
                  For components selecting multiple state fields, use useShallow to
                  prevent unnecessary re-renders on unrelated state updates:
                  ```ts
                  // In consuming component:
                  import { useShallow } from 'zustand/react/shallow';
                  const { toastMessage, clearToast } = useUIStore(
                    useShallow((s) => ({ toastMessage: s.toastMessage, clearToast: s.clearToast }))
                  );
                  ```
     → Fail Mode: useStore(selector, shallow) (v4 syntax) is deprecated in v5 and may
                  not be recognized by the type system. Always use useShallow from
                  zustand/react/shallow instead.
     → NOTE: Zustand v5 uses React's native useSyncExternalStore — no external shim
             package needed. This guarantees tear-free concurrent rendering under React 19.2.

7.4. [CONFIGURE] Development debugging — Reactotron (React Native devtools)
     → Input    : Development environment
     → Output   : Reactotron configured for query/store inspection
     → Tool/Cmd : `pnpm add -D reactotron-react-native reactotron-redux`
                  Create `src/lib/reactotron.ts` (import in _layout.tsx in __DEV__ guard).
                  Ensure device and dev machine are on same network.
                  `sudo ufw allow 9090`   # open Reactotron port on Linux firewall
     → Fail Mode: Not connecting — firewall; verify with `sudo ufw status`.

7.5. [VERIFY] Confirm QueryClient is mounted and stores initialize cleanly
     → Input    : Root layout from Phase 6.3
     → Output   : No runtime errors; authStore initializes to isLoading: true
     → Tool/Cmd : `npx expo start --clear`
                  Add temporary log: `console.log(useAuthStore.getState())` in index.tsx.
                  Remove before Phase 15.6.
     → Fail Mode: "No QueryClient set" — QueryClientProvider missing from tree;
                  verify _layout.tsx wraps Stack inside the provider.

7.6. [COMMIT] Commit state management setup
     → Input    : src/lib/queryClient.ts, src/store/*.ts
     → Output   : Git commit
     → Tool/Cmd : `git add src/lib/ src/store/ && git commit -m "feat: TanStack Query v5 + Zustand v5 state management"`
     → Fail Mode: None beyond standard git issues.
```

**Postcondition:** QueryClient v5 singleton configured. Auth and UI Zustand v5 stores operational with named exports and useShallow patterns. No v4 deprecated patterns present.

**Feedback Gate:** BACK → PHASE 7 if Phase 10 reveals query defaults inappropriate for Supabase response characteristics.

---

## PHASE 8: Component & Screen Development

**Goal:** Build the component library and screen compositions. Under React 19.2 + React Compiler, manual memoization is unnecessary — focus on pure functions and atomic state.

**Precondition:** Phase 7 complete. Navigation and state management operational.

---

```
8.1. [DESIGN] Define component taxonomy
     → Input    : Feature requirements
     → Output   : Updated ARCHITECTURE.md with component categories
     → Tool/Cmd : Document:
                  Primitives  — Text, Button, Input, Icon (no business logic)
                  Composites  — Form, Card, ListItem (composed from Primitives)
                  Screens     — Full-page layouts; connected to hooks/stores
                  Layouts     — SafeAreaView wrappers, KeyboardAwareView, etc.
     → Fail Mode: None — design documentation, no runtime impact.

8.2. [CREATE] Button primitive
     → Input    : Design system tokens
     → Output   : src/components/Button.tsx
     → Tool/Cmd : Create with:
                  - Variants: primary | secondary | destructive
                  - Props: onPress, label, disabled, loading, accessibilityLabel (required)
                  - Uses StyleSheet.create for performance
                  - ActivityIndicator for loading state
                  - `accessible={true}` and `accessibilityRole="button"`
                  - `testID` prop (required for Phase 12 Testing Library integration)
     → Fail Mode: Missing testID — will block Phase 12 integration tests.
                  Missing accessibilityLabel — fails Phase 14 accessibility audit.
     → NOTE: Do NOT wrap in React.memo. The React Compiler in SDK 55 automatically
             memoizes this component. Manual wrapping adds overhead without benefit.

8.3. [CREATE] TextInput primitive
     → Input    : Form requirements
     → Output   : src/components/TextInput.tsx
     → Tool/Cmd : Create with:
                  - Props: value, onChangeText, error, label, secureTextEntry,
                           keyboardType, testID (required), accessibilityLabel (required)
                  - Displays error string below input when `error` is set
                  - `autoCorrect={false}` for credential fields
     → Fail Mode: Missing testID — blocks Phase 12 tests.
     → NOTE: Do NOT wrap in React.memo. Same reasoning as 8.2.

8.4. [CREATE] Login screen
     → Input    : (auth)/login route from Phase 6.2
     → Output   : src/app/(auth)/login.tsx
     → Tool/Cmd : Implement with:
                  - Email TextInput (keyboardType="email-address", autoCapitalize="none")
                  - Password TextInput (secureTextEntry={true})
                  - Submit Button (testID="login-button", connected to Phase 9 mutation)
                  - Link to register: `<Link href="/(auth)/register">`
                  - Loading/error states from authStore
                  - KeyboardAvoidingView wrapper:
                    `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`
     → Fail Mode: Keyboard covers inputs — missing KeyboardAvoidingView wrapper.

8.5. [CREATE] Home tab screen (stub — wired to real data in Phase 10)
     → Input    : (tabs)/index.tsx
     → Output   : Minimal stub with testID="home-screen" on root view
     → Tool/Cmd : Implement minimal screen with heading and placeholder content.
                  Add `testID="home-screen"` to root View — required by Phase 12.6 E2E test.
     → Fail Mode: Missing testID="home-screen" will break E2E login flow test.

8.6. [CREATE] Profile screen
     → Input    : (tabs)/profile.tsx, authStore
     → Output   : Profile screen showing user email + logout button
     → Tool/Cmd : Implement with:
                  - `session?.user?.email ?? ''` from authStore (null-guard mandatory)
                  - Logout Button → calls signOut from Phase 9
     → Fail Mode: Null session access — guard with optional chaining as above.

8.7. [VERIFY] All screens render without errors on device
     → Input    : Connected device
     → Output   : All screens navigable; no red error screens
     → Tool/Cmd : `npx expo start --clear`
                  Navigate every defined route manually.
     → Fail Mode: "Text strings must be rendered within a <Text>" — locate stray string
                  literals outside JSX Text tags.

8.8. [COMMIT] Commit component and screen foundation
     → Input    : All component and screen files
     → Output   : Git commit
     → Tool/Cmd : `git add src/components/ src/app/ && git commit -m "feat: core components and screen scaffolds"`
     → Fail Mode: None beyond standard git issues.
```

**Postcondition:** Core primitives exist with `testID` and accessibility props. All routes render. No manual React.memo wrappers — React Compiler handles memoization.

**Feedback Gate:** BACK → PHASE 8 if Phase 12 reveals missing `testID` props or accessibility failures.

---

## PHASE 9: Business Logic & Service Layer

**Goal:** Implement all business logic, authentication flows, and service abstractions, isolated from UI.

**Precondition:** Phase 8 complete.

---

```
9.1. [CREATE] Supabase client singleton
     → Input    : Config from Phase 5.3
     → Output   : src/services/supabase.ts
     → Tool/Cmd : Create `src/services/supabase.ts`:
                  ```ts
                  import 'react-native-url-polyfill/auto';  // see NOTE below
                  import { createClient } from '@supabase/supabase-js';
                  import AsyncStorage from '@react-native-async-storage/async-storage';
                  import { Config } from '@/constants/config';

                  export const supabase = createClient(Config.supabaseUrl, Config.supabaseAnonKey, {
                    auth: {
                      storage: AsyncStorage,
                      autoRefreshToken: true,
                      persistSession: true,
                      detectSessionInUrl: false,   // REQUIRED for React Native
                    },
                  });
                  ```
     → Fail Mode: URL parsing error on startup — missing url polyfill import.
                  Session not persisting — missing AsyncStorage config.
     → NOTE: detectSessionInUrl: false is mandatory for React Native; OAuth flows
             use deep links, not URL bar parsing.
             URL polyfill: retained by default. After integration testing confirms
             no auth parsing failures on Hermes/RN 0.83, this import can be removed
             in Phase 13 as a cleanup step (see Phase 4.3 note).

9.2. [CREATE] Auth service
     → Input    : supabase client
     → Output   : src/services/authService.ts
     → Tool/Cmd : Create `src/services/authService.ts`:
                  ```ts
                  import { supabase } from './supabase';

                  export const authService = {
                    signIn: (email: string, password: string) =>
                      supabase.auth.signInWithPassword({ email, password }),

                    signUp: (email: string, password: string) =>
                      supabase.auth.signUp({ email, password }),

                    signOut: () => supabase.auth.signOut(),

                    getSession: () => supabase.auth.getSession(),

                    onAuthStateChange: (
                      callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
                    ) => supabase.auth.onAuthStateChange(callback),
                  };
                  ```
     → Fail Mode: JWT refresh fails after expiry — Supabase handles this automatically
                  when autoRefreshToken: true (confirmed in 9.1).

9.3. [CREATE] useSession hook — bootstrap auth into Zustand
     → Input    : authService, useAuthStore
     → Output   : src/hooks/useSession.ts
     → Tool/Cmd : Create `src/hooks/useSession.ts`:
                  ```ts
                  import { useEffect } from 'react';
                  import { useAuthStore } from '@/store/authStore';
                  import { authService } from '@/services/authService';

                  export function useSession() {
                    const { session, isLoading, setSession, setLoading } = useAuthStore();

                    useEffect(() => {
                      let active = true;
                      authService.getSession().then(({ data: { session } }) => {
                        if (active) {
                          setSession(session);
                          setLoading(false);
                        }
                      });

                      const { data: { subscription } } = authService.onAuthStateChange(
                        (_event, session) => setSession(session)
                      );

                      return () => {
                        active = false;
                        subscription.unsubscribe();
                      };
                    }, []);

                    return { session, loading: isLoading };
                  }
                  ```
     → Fail Mode: setState on unmounted component — `active` flag prevents this.

9.4. [CREATE] useSignIn mutation hook (TanStack Query v5 mutation)
     → Input    : authService.signIn
     → Output   : src/hooks/useSignIn.ts
     → Tool/Cmd : Create `src/hooks/useSignIn.ts`:
                  ```ts
                  import { useMutation } from '@tanstack/react-query';
                  import { authService } from '@/services/authService';
                  import { router } from 'expo-router';

                  export function useSignIn() {
                    return useMutation({
                      mutationFn: ({ email, password }: { email: string; password: string }) =>
                        authService.signIn(email, password),
                      onSuccess: ({ data, error }) => {
                        // NOTE: useMutation onSuccess/onError/onSettled ARE still supported in v5.
                        // It is useQuery that dropped these callbacks. Mutations retain them.
                        if (error) throw error;
                        router.replace('/(tabs)');
                      },
                      onError: () => {
                        // mutation.error is available in the calling component for display
                      },
                    });
                  }
                  ```
     → Fail Mode: Supabase returns error in data.error, not thrown — check and throw
                  manually as shown above.
     → NOTE: TanStack Query v5 removed onSuccess/onError/onSettled from useQuery only.
             useMutation retains these callbacks. Side effects from queries must use
             useEffect watching isSuccess/isError instead.

9.5. [CREATE] Generic Supabase data service
     → Input    : Supabase database schema
     → Output   : src/services/dataService.ts
     → Tool/Cmd : Create `src/services/dataService.ts`:
                  ```ts
                  import { supabase } from './supabase';

                  export const dataService = {
                    list: <T>(table: string) =>
                      supabase.from(table).select('*').returns<T[]>(),

                    getById: <T>(table: string, id: string) =>
                      supabase.from(table).select('*').eq('id', id).single<T>(),

                    create: <T>(table: string, data: Partial<T>) =>
                      supabase.from(table).insert(data).select().single<T>(),

                    update: <T>(table: string, id: string, data: Partial<T>) =>
                      supabase.from(table).update(data).eq('id', id).select().single<T>(),

                    delete: (table: string, id: string) =>
                      supabase.from(table).delete().eq('id', id),
                  };
                  ```
     → Fail Mode: 403 responses — RLS policy blocks the query. Configure RLS in Supabase
                  dashboard for each table; 403 = missing or incorrect policy.

9.6. [COMMIT] Commit service layer
     → Input    : src/services/, src/hooks/
     → Output   : Git commit
     → Tool/Cmd : `git add src/services/ src/hooks/ && git commit -m "feat: Supabase service layer and auth hooks"`
     → Fail Mode: None beyond standard git issues.
```

**Postcondition:** Supabase client initialized. Auth flows implemented behind service + hook abstraction. Business logic decoupled from UI.

**Feedback Gate:** BACK → PHASE 5 if Supabase credentials are wrong — do NOT hardcode as a fix.

---

## PHASE 10: API Integration

**Goal:** Connect screens to Supabase data via TanStack Query v5 hooks. Schema generation uses the Supabase CLI with service-role authentication — the anon key can no longer access the OpenAPI schema endpoint.

**Precondition:** Phase 9 complete. Supabase project has at least one table with RLS enabled.

---

```
10.1. [GENERATE] Generate TypeScript types from Supabase schema via CLI
      → Input    : Supabase CLI authenticated with service role / personal access token
      → Output   : src/types/database.types.ts
      → Tool/Cmd : `npx supabase login`   # authenticates via browser; uses personal access token
                   `npx supabase gen types typescript --project-id {{SUPABASE_PROJECT_ID}} > src/types/database.types.ts`
      → Fail Mode: 403 Forbidden — effective March 11, 2026, Supabase deprecated access to
                   the /rest/v1/ OpenAPI schema via the anon key. The CLI must be
                   authenticated with a personal access token or service role, not anon.
                   Resolution: ensure `supabase login` is complete and the session is active.
      → CRITICAL: Never attempt to generate types by calling the /rest/v1/ endpoint
                  directly with the SUPABASE_ANON_KEY. This now returns 403.
                  The public app bundle must never contain schema introspection logic.

10.2. [CREATE] TanStack Query v5 hook for listing a resource
      → Input    : dataService.list, generated types
      → Output   : src/hooks/useItems.ts (replace "Items" with your resource name)
      → Tool/Cmd : Create `src/hooks/useItems.ts`:
                   ```ts
                   import { useQuery } from '@tanstack/react-query';
                   import { dataService } from '@/services/dataService';
                   import type { Database } from '@/types/database.types';

                   type Item = Database['public']['Tables']['{{TABLE_NAME}}']['Row'];

                   export const itemKeys = {
                     all: ['items'] as const,
                     detail: (id: string) => ['items', id] as const,
                   };

                   export function useItems() {
                     return useQuery({
                       queryKey: itemKeys.all,
                       queryFn: async () => {
                         const { data, error } = await dataService.list<Item>('{{TABLE_NAME}}');
                         if (error) throw error;
                         return data;
                       },
                       // DO NOT add onSuccess/onError here — removed from useQuery in v5.
                       // Use useEffect watching isSuccess/isError in the component instead.
                     });
                   }
                   ```
      → Fail Mode: Using onSuccess/onError in useQuery config — TypeScript will error in v5.
                   Move side effects to useEffect in the consuming component.

10.3. [CREATE] TanStack Query v5 mutation hook with cache invalidation
      → Input    : dataService.create, queryClient
      → Output   : src/hooks/useCreateItem.ts
      → Tool/Cmd : Create `src/hooks/useCreateItem.ts`:
                   ```ts
                   import { useMutation, useQueryClient } from '@tanstack/react-query';
                   import { dataService } from '@/services/dataService';
                   import { itemKeys } from './useItems';

                   export function useCreateItem() {
                     const queryClient = useQueryClient();
                     return useMutation({
                       mutationFn: (newItem: { name: string }) =>
                         dataService.create('{{TABLE_NAME}}', newItem),
                       onSuccess: () => {
                         // useMutation retains onSuccess in v5
                         queryClient.invalidateQueries({ queryKey: itemKeys.all });
                       },
                     });
                   }
                   ```
      → Fail Mode: Race condition on invalidation/refetch — TanStack Query handles this
                   correctly internally; do not add manual delays.

10.4. [INTEGRATE] Wire Home screen to live data
      → Input    : src/app/(tabs)/index.tsx stub from Phase 8.5
      → Output   : Screen displays live Supabase data
      → Tool/Cmd : Update to use `useItems()`:
                   - isLoading → render loading spinner
                   - isError → render error message
                   - data → render FlatList
                   Side effects (e.g., showing a toast on success) go in useEffect:
                   ```ts
                   useEffect(() => {
                     if (isSuccess) showToast('Data loaded');
                   }, [isSuccess]);
                   ```
      → Fail Mode: Empty data (not error) — check RLS policies. Test in Supabase SQL Editor
                   using the auth.uid() of your test user.

10.5. [VERIFY] Manual CRUD verification on physical device
      → Input    : Connected Android device, Supabase table with test data
      → Output   : Create/Read/Update/Delete confirmed end-to-end
      → Tool/Cmd : `npx expo start --clear`
                   Exercise all CRUD operations in the app.
                   Confirm changes in Supabase dashboard → Table Editor.
      → Fail Mode: CORS error — only appears in web; switch to native device target.

10.6. [COMMIT] Commit API integration layer
      → Input    : src/hooks/use*.ts, src/types/database.types.ts, updated screens
      → Output   : Git commit
      → Tool/Cmd : `git add src/hooks/ src/types/ src/app/ && git commit -m "feat: Supabase API integration with TanStack Query v5"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** App reads and writes real data from Supabase. TanStack Query v5 patterns observed throughout (no onSuccess on queries; side effects in useEffect). Schema generation uses authenticated CLI, not anon key.

**Feedback Gate:** BACK → PHASE 9 if service layer abstractions are insufficient for query complexity.

---

## PHASE 11: Local Storage & Persistence

**Goal:** Implement all client-side persistence: auth session (AsyncStorage via Supabase), user preferences (Zustand v5 persist middleware), and offline query caching.

**Precondition:** Phase 10 complete. AsyncStorage installed.

---

```
11.1. [VERIFY] Auth session persists across app restarts
      → Input    : Working auth flow
      → Output   : User remains logged in after force-close + reopen
      → Tool/Cmd : Sign in → Force close app → Reopen → Confirm redirect to (tabs).
                   `AsyncStorage.getItem('supabase.auth.token')` to inspect stored token.
      → Fail Mode: Session not restored — verify AsyncStorage is in supabase.ts auth config.

11.2. [CREATE] User preferences store — Zustand v5 persist middleware
      → Input    : Zustand v5, AsyncStorage
      → Output   : src/store/preferencesStore.ts
      → Tool/Cmd : Create `src/store/preferencesStore.ts`:
                   ```ts
                   import { create } from 'zustand';   // named import — v5
                   import { persist, createJSONStorage } from 'zustand/middleware';
                   import AsyncStorage from '@react-native-async-storage/async-storage';

                   interface PreferencesState {
                     theme: 'light' | 'dark' | 'system';
                     language: string;
                     setTheme: (theme: 'light' | 'dark' | 'system') => void;
                     setLanguage: (lang: string) => void;
                   }

                   export const usePreferencesStore = create<PreferencesState>()(
                     persist(
                       (set) => ({
                         theme: 'system',
                         language: 'en',
                         setTheme: (theme) => set({ theme }),
                         setLanguage: (language) => set({ language }),
                       }),
                       {
                         name: 'user-preferences',
                         storage: createJSONStorage(() => AsyncStorage),
                       }
                     )
                   );
                   ```
      → Fail Mode: Rehydration race condition — v5 persist middleware includes fixes for
                   this specifically. Use `usePreferencesStore.persist.hasHydrated()` to
                   gate renders that depend on persisted values being available.

11.3. [CREATE] Offline-aware query caching via TanStack AsyncStorage persister
      → Input    : queryClient from Phase 7.1
      → Output   : src/lib/persister.ts; PersistQueryClientProvider in root layout
      → Tool/Cmd : `pnpm add @tanstack/query-async-storage-persister @tanstack/react-query-persist-client`
                   Create `src/lib/persister.ts`:
                   ```ts
                   import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
                   import AsyncStorage from '@react-native-async-storage/async-storage';

                   export const asyncStoragePersister = createAsyncStoragePersister({
                     storage: AsyncStorage,
                     maxAge: 1000 * 60 * 60 * 24,   // 24 hours
                   });
                   ```
                   Wrap QueryClientProvider in _layout.tsx with PersistQueryClientProvider.
      → Fail Mode: Stale cache served when online — maxAge prevents indefinite stale reads.

11.4. [VERIFY] Persistence across restarts
      → Input    : Physical device
      → Output   : Theme preference and cached data survive app restart
      → Tool/Cmd : Set theme pref → Kill app → Reopen → Confirm retained.
                   Enable airplane mode → Open app → Confirm cached data shown.
      → Fail Mode: Cache not loading offline — verify PersistQueryClientProvider is
                   correctly wrapping the component tree.

11.5. [COMMIT] Commit persistence layer
      → Input    : src/store/preferencesStore.ts, src/lib/persister.ts, updated layout
      → Output   : Git commit
      → Tool/Cmd : `git add src/store/ src/lib/ src/app/_layout.tsx && git commit -m "feat: Zustand v5 persist + TanStack query cache persistence"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** Auth session persists. User preferences survive restarts. Query cache supports offline reads with 24-hour maxAge.

**Feedback Gate:** BACK → PHASE 7 if QueryClient config requires modification for persistence compatibility.

---

## PHASE 12: Testing

**Goal:** Three-tier test suite: unit (logic/stores), integration (screens), E2E (Detox 20.47.0 on Android locally; iOS E2E via macOS GitHub Actions runner).

**Precondition:** Phase 11 complete. Jest, Testing Library, Detox 20.47.0 installed.

---

```
12.1. [CONFIGURE] Finalize Jest for Expo SDK 55 / RN 0.83
      → Input    : package.json jest config from Phase 4.8
      → Output   : Jest runs without configuration errors
      → Tool/Cmd : Ensure transformIgnorePatterns whitelist is current for SDK 55:
                   ```json
                   {
                     "jest": {
                       "preset": "jest-expo",
                       "setupFilesAfterFramework": ["@testing-library/jest-native/extend-expect"],
                       "transformIgnorePatterns": [
                         "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
                       ]
                     }
                   }
                   ```
                   `pnpm test -- --passWithNoTests`
      → Fail Mode: Transform error for expo/react-native module — add the failing module
                   to the transformIgnorePatterns whitelist.

12.2. [WRITE] Unit tests — pure utility functions
      → Input    : src/utils/ functions
      → Output   : src/utils/__tests__/*.test.ts
      → Tool/Cmd : Cover: happy path, edge cases (null/empty/boundary), error cases.
                   `pnpm test src/utils`
      → Fail Mode: Import failures for utils with side effects — mock with `jest.mock()`.

12.3. [WRITE] Unit tests — Zustand v5 stores
      → Input    : src/store/*.ts
      → Output   : src/store/__tests__/*.test.ts
      → Tool/Cmd : ```ts
                   import { useAuthStore } from '@/store/authStore';
                   beforeEach(() => useAuthStore.setState({ session: null, isLoading: true }));
                   test('setSession updates session', () => {
                     useAuthStore.getState().setSession({ user: { email: 'test@test.com' } } as any);
                     expect(useAuthStore.getState().session?.user.email).toBe('test@test.com');
                   });
                   ```
      → Fail Mode: AsyncStorage not mocked — add to jest setup:
                   `jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));`

12.4. [WRITE] Integration tests — screens with Testing Library
      → Input    : Screen components, mocked services
      → Output   : src/app/__tests__/*.test.tsx
      → Tool/Cmd : ```ts
                   import { render, fireEvent, waitFor } from '@testing-library/react-native';
                   jest.mock('@/hooks/useSignIn');
                   test('shows error on failed login', async () => {
                     const { getByTestId, getByText } = render(<LoginScreen />);
                     fireEvent.changeText(getByTestId('email-input'), 'bad@email.com');
                     fireEvent.changeText(getByTestId('password-input'), 'wrong');
                     fireEvent.press(getByTestId('login-button'));
                     await waitFor(() => expect(getByText(/invalid credentials/i)).toBeTruthy());
                   });
                   ```
      → Fail Mode: Missing testID on components — BACK → PHASE 8 to add.

12.5. [CONFIGURE] Detox 20.47.0 for Android E2E (local + CI)
      → Input    : Detox installed, dev APK available (from Phase 16.4)
      → Output   : .detoxrc.js configured for Android attached device
      → Tool/Cmd : Create `.detoxrc.js`:
                   ```js
                   module.exports = {
                     testRunner: { args: { '$0': 'jest', config: 'e2e/jest.config.js' } },
                     apps: {
                       'android.debug': {
                         type: 'android.apk',
                         binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
                         build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
                       },
                     },
                     devices: {
                       attached: { type: 'android.attached', device: { adbName: '.*' } },
                     },
                     configurations: {
                       'android.att': { device: 'attached', app: 'android.debug' },
                     },
                   };
                   ```
                   Detox 20.47.0 supports New Architecture up to RN 0.82 officially;
                   community patches extend to 0.83. Monitor https://github.com/wix/Detox
                   for official 0.83 support confirmation before running E2E in CI.
      → Fail Mode: Detox requires dev client build — cannot attach to Expo Go.
                   EAS dev build (Phase 16.4) must be completed first.

12.6. [CONFIGURE] iOS E2E via macOS GitHub Actions runner
      → Input    : GitHub Actions CI (Phase 17)
      → Output   : .github/workflows/e2e-ios.yml — runs iOS Detox on cloud macOS runner
      → Tool/Cmd : Create `.github/workflows/e2e-ios.yml`:
                   ```yaml
                   name: iOS E2E
                   on:
                     push:
                       branches: [main, develop]
                   jobs:
                     ios-e2e:
                       runs-on: macos-latest
                       steps:
                         - uses: actions/checkout@v4
                         - uses: actions/setup-node@v4
                           with: { node-version: '24' }
                         - uses: pnpm/action-setup@v3
                           with: { version: '10' }
                         - run: pnpm install
                         - run: xcrun simctl list   # verify simulator available
                         - run: pnpm detox build -c ios.sim.debug
                         - run: pnpm detox test -c ios.sim.debug
                   ```
                   Add ios simulator configuration to .detoxrc.js for this runner.
      → Fail Mode: macOS runner cost — GitHub Actions macOS runners consume minutes 10x
                   faster than Linux. Gate this workflow on main/develop only (not all PRs)
                   to manage CI costs.
     → LINUX NOTE: This is the ONLY path for iOS E2E testing from a Linux development
                   machine. There is no local alternative.

12.7. [WRITE] E2E test — login critical path
      → Input    : e2e/ directory, Detox configured
      → Output   : e2e/login.test.js
      → Tool/Cmd : ```js
                   describe('Login flow', () => {
                     beforeAll(async () => { await device.launchApp(); });
                     it('logs in with valid credentials', async () => {
                       await element(by.id('email-input')).typeText('{{TEST_USER_EMAIL}}');
                       await element(by.id('password-input')).typeText('{{TEST_USER_PASSWORD}}');
                       await element(by.id('login-button')).tap();
                       await expect(element(by.id('home-screen'))).toBeVisible();
                     });
                   });
                   ```
                   Test user must be seeded in Supabase Auth before E2E run.
      → Fail Mode: Test user not created — create via Supabase dashboard or seed script.

12.8. [RUN] Full test suite with coverage enforcement
      → Input    : All tests written
      → Output   : Zero failures; coverage ≥70% on lines
      → Tool/Cmd : `pnpm test -- --coverage --coverageThreshold='{"global":{"lines":70}}'`
      → Fail Mode: Below threshold — write tests for uncovered paths.
                   Do NOT lower the threshold.

12.9. [COMMIT] Commit test suite
      → Input    : All test files, Detox config, iOS E2E workflow
      → Output   : Git commit
      → Tool/Cmd : `git add src/**/__tests__/ e2e/ .detoxrc.js .github/workflows/e2e-ios.yml && git commit -m "test: unit, integration, E2E (Detox 20.47) + iOS macOS runner"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** Unit and integration tests passing ≥70% coverage. Android E2E runnable on physical device via Detox 20.47.0. iOS E2E configured for macOS GitHub Actions runner.

**Feedback Gate:** BACK → PHASE 8 if missing `testID` props require component changes.

---

## PHASE 13: Performance Optimization

**Goal:** Identify and resolve performance bottlenecks with React Compiler as the default memoization layer. Manual memo strategies from pre-SDK 55 workflows are obsolete.

**Precondition:** Phase 12 complete. App is functionally complete.

---

```
13.1. [UNDERSTAND] React Compiler baseline — what is automated in SDK 55
      → Input    : SDK 55 project (React 19.2 + React Compiler active by default)
      → Output   : Team understanding of what NOT to do manually
      → Tool/Cmd : The React Compiler automatically:
                   - Wraps component functions in equivalent of React.memo
                   - Memoizes computed values (equivalent of useMemo)
                   - Stabilizes callbacks (equivalent of useCallback)
                   DO NOT add manual React.memo, useMemo, or useCallback wrappers.
                   These add overhead on top of compiler-managed memoization.
                   Focus instead on: pure functions, atomic state, no mutation of props.
      → Fail Mode: Legacy React.memo patterns from v1 workflow left in component files —
                   audit src/components/ and remove all manual React.memo wraps.
                   BACK → PHASE 8 to remove them.

13.2. [AUDIT] Enable performance monitor on physical Android device
      → Input    : Android device in dev build
      → Output   : FPS and JS thread load visible
      → Tool/Cmd : Shake device → "Perf Monitor"
                   Target: UI thread ≥60fps, JS thread ≥45fps sustained.
      → Fail Mode: FPS drops below 45 — profile with Flipper or Android Studio Profiler.

13.3. [OPTIMIZE] FlatList rendering correctness (not memoization — the Compiler handles that)
      → Input    : FlatList components in screens
      → Output   : Correctly configured lists with stable keys and layout hints
      → Tool/Cmd : Verify every FlatList has:
                   - `keyExtractor` returning a stable string ID (never array index)
                   - `getItemLayout` if items have fixed height (removes measurement overhead)
                   - `initialNumToRender` set to visible viewport item count
                   - `windowSize` reduced (default 21 is high for mobile — try 5–10)
      → Fail Mode: Unstable keys cause unnecessary full list re-renders; keyExtractor
                   must return the item's unique database ID.

13.4. [OPTIMIZE] Image optimization
      → Input    : Images in src/assets/
      → Output   : Compressed WebP assets; expo-image for caching and placeholders
      → Tool/Cmd : `npx expo install expo-image`
                   Replace all `<Image>` from react-native with `<Image>` from expo-image.
                   expo-image provides disk+memory caching, progressive loading, and
                   blurhash placeholders natively.
                   Convert source images:
                   `sudo apt install -y webp`
                   `cwebp input.png -o output.webp`
      → Fail Mode: expo-image requires API 21+ on Android — verify minSdkVersion in
                   app.json android config.

13.5. [OPTIMIZE] TanStack Query — per-query staleTime tuning
      → Input    : All useQuery hooks
      → Output   : Reduced unnecessary network requests
      → Tool/Cmd : Categorize by data volatility and override per-query:
                   - Static (user profile):    `staleTime: Infinity` (+ explicit invalidation on mutation)
                   - Semi-static (app config): `staleTime: 1000 * 60 * 30`
                   - Dynamic (feed data):      `staleTime: 1000 * 60 * 2`
      → Fail Mode: Infinity staleTime with no mutation invalidation — data never refreshes.
                   Ensure all relevant mutations call queryClient.invalidateQueries.

13.6. [CLEANUP] Evaluate removal of react-native-url-polyfill (from Phase 4.3 / 9.1)
      → Input    : Integration tests passing, Supabase auth confirmed stable on Hermes
      → Output   : Decision: retain or remove polyfill
      → Tool/Cmd : Run full auth flow on physical iOS and Android devices.
                   Run integration tests: `pnpm test`
                   If zero URL parsing errors observed: remove `react-native-url-polyfill`
                   from package.json and the import from supabase.ts.
                   `pnpm test && npx expo start --clear` — verify no regressions.
      → Fail Mode: Auth URL errors reappear — restore the polyfill. Hermes URL
                   implementation may still have gaps on this RN version.

13.7. [OPTIMIZE] Bundle analysis
      → Input    : Built bundle
      → Output   : Bundle composition report; large deps identified
      → Tool/Cmd : `npx expo export --platform android`
                   `pnpm add -D source-map-explorer`
                   `npx source-map-explorer dist/_expo/static/js/android/*.js`
      → Fail Mode: source-map-explorer unavailable — use `npx expo export --dump-sourcemap`.

13.8. [COMMIT] Commit optimizations
      → Input    : All changes (FlatList config, expo-image, staleTime updates, optional polyfill removal)
      → Output   : Git commit
      → Tool/Cmd : `git add . && git commit -m "perf: FlatList optimization, expo-image, query staleTime tuning"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** No manual memoization wrappers remain (React Compiler handles this). App sustains 60fps on mid-range Android. Images optimized. Bundle size analyzed. Stale times tuned.

**Feedback Gate:** BACK → PHASE 4 if bundle analysis reveals a large dependency to replace or eliminate.

---

## PHASE 14: Accessibility & Internationalization

**Goal:** Meet WCAG 2.1 AA accessibility standards. Externalize all user-visible strings to i18next.

**Precondition:** Phase 13 complete. Final content on all screens.

---

```
14.1. [AUDIT] TalkBack navigation on Android
      → Input    : Physical Android device, all screens
      → Output   : Every interactive element spoken; focus order logical
      → Tool/Cmd : Enable TalkBack: Settings → Accessibility → TalkBack
                   Navigate entire app. Verify:
                   - Every Button has spoken label (accessibilityLabel)
                   - Every TextInput has spoken label and role
                   - Error messages are announced when shown
                   - Focus order matches visual reading order
      → Fail Mode: Unlabeled elements — BACK → PHASE 8 to add accessibilityLabel
                   and accessibilityRole to all interactive components.

14.2. [AUDIT] VoiceOver — iOS, via Expo Go on physical iOS device
      → Input    : Physical iOS device with Expo Go
      → Output   : Equivalent accessibility on iOS
      → Tool/Cmd : Enable VoiceOver: Settings → Accessibility → VoiceOver
                   Navigate entire app with same checklist as 14.1.
      → Fail Mode: iOS-specific accessibility issues (focus trap in modals, etc.) —
                   consult expo-router v7 docs for modal accessibility handling.

14.3. [VERIFY] Color contrast ≥4.5:1
      → Input    : App color palette from src/constants/
      → Output   : All text/background combos meet AA standard
      → Tool/Cmd : Check each color pair at https://webaim.org/resources/contrastchecker/
      → Fail Mode: Brand color fails — add high-contrast text variant; do not
                   compromise brand color in standard UI.

14.4. [INSTALL] i18next and expo-localization
      → Input    : Project root
      → Output   : i18next + react-i18next + expo-localization installed
      → Tool/Cmd : `pnpm add i18next react-i18next`
                   `npx expo install expo-localization`
                   # Use npx expo install for all expo-namespaced packages to get
                   # the SDK 55-compatible version
      → Fail Mode: Version conflict on expo-localization — npx expo install resolves
                   this by selecting the SDK-matched version.

14.5. [CONFIGURE] i18next initialization with device locale detection
      → Input    : expo-localization, i18next
      → Output   : src/i18n/index.ts + src/i18n/locales/en.json
      → Tool/Cmd : Create `src/i18n/index.ts`:
                   ```ts
                   import i18n from 'i18next';
                   import { initReactI18next } from 'react-i18next';
                   import * as Localization from 'expo-localization';
                   import en from './locales/en.json';

                   i18n.use(initReactI18next).init({
                     resources: { en: { translation: en } },
                     lng: Localization.getLocales()[0]?.languageCode ?? 'en',
                     fallbackLng: 'en',
                     interpolation: { escapeValue: false },
                     missingKeyHandler: (lngs, ns, key) => {
                       if (__DEV__) console.warn(`Missing i18n key: ${key}`);
                     },
                   });

                   export default i18n;
                   ```
                   Import at top of src/app/_layout.tsx.
      → Fail Mode: Strings not updating on language change — call `i18n.changeLanguage()`
                   and verify components using useTranslation() are re-rendering.

14.6. [REFACTOR] Replace all hardcoded user-visible strings with i18n keys
      → Input    : All screen and component files
      → Output   : Zero hardcoded user-visible strings
      → Tool/Cmd : In each component: `const { t } = useTranslation();`
                   Replace: `"Log In"` → `{t('auth.login.button')}`
      → Fail Mode: Missing key renders raw key string — missingKeyHandler logs this
                   in development.

14.7. [COMMIT] Commit accessibility and i18n
      → Input    : All modified files
      → Output   : Git commit
      → Tool/Cmd : `git add . && git commit -m "feat: accessibility + i18n setup"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** TalkBack and VoiceOver navigable. All interactive elements labeled. Contrast ≥4.5:1. All user strings in i18n locale files.

**Feedback Gate:** BACK → PHASE 8 if structural component changes required for accessibility.

---

## PHASE 15: Security Hardening

**Goal:** Harden against token exposure, schema leakage, input injection, and debug information disclosure.

**Precondition:** Phase 14 complete. Auth and data layers finalized.

---

```
15.1. [AUDIT] Verify no secrets in source code or git history
      → Input    : Entire git repository
      → Output   : Zero secrets in code or history
      → Tool/Cmd : `git log --all --full-history -- '**/.env*'`
                   `grep -rn 'SUPABASE_' src/ --include="*.ts" --include="*.tsx"`
                   # should show only Config imports, not raw strings
                   `pip install trufflehog3 --break-system-packages`
                   `trufflehog3 --no-history .`
      → Fail Mode: Secret in history — rotate key immediately in Supabase dashboard.
                   Git history rewrite is insufficient; treat as compromised.

15.2. [IMPLEMENT] SecureStore for JWT persistence (mandatory for production)
      → Input    : Supabase client config from Phase 9.1
      → Output   : JWT stored in hardware-backed keystore, not plain AsyncStorage
      → Tool/Cmd : `npx expo install expo-secure-store`
                   Create `src/lib/secureStorage.ts` implementing the AsyncStorage interface:
                   ```ts
                   import * as SecureStore from 'expo-secure-store';
                   import { Platform } from 'react-native';

                   // expo-secure-store has a 2048-byte per-entry limit.
                   // Store refresh token in SecureStore; access token in memory only.
                   export const secureStorageAdapter = {
                     getItem: (key: string) => SecureStore.getItemAsync(key),
                     setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
                     removeItem: (key: string) => SecureStore.deleteItemAsync(key),
                   };
                   ```
                   Update supabase.ts to use secureStorageAdapter instead of AsyncStorage
                   in the auth.storage field.
      → Fail Mode: 2048-byte limit exceeded — access token may be large; store only
                   the refresh token key in SecureStore. Access token lives in memory.
                   iOS Keychain: encrypted by default. Android Keystore: encrypted on
                   API 23+ (all modern devices). Do not use AsyncStorage for auth tokens
                   in production.

15.3. [IMPLEMENT] Input validation with Zod v4
      → Input    : All user-facing form inputs
      → Output   : src/utils/validation.ts with Zod v4 schemas
      → Tool/Cmd : Create `src/utils/validation.ts`:
                   ```ts
                   import { z } from 'zod';

                   export const loginSchema = z.object({
                     email: z.string().email('Invalid email'),
                     password: z.string().min(8, 'Minimum 8 characters'),
                   });

                   export const registerSchema = z.object({
                     email: z.string().email('Invalid email'),
                     password: z.string().min(8, 'Minimum 8 characters'),
                     confirmPassword: z.string(),
                   }).refine((data) => data.password === data.confirmPassword, {
                     message: 'Passwords do not match',
                     path: ['confirmPassword'],
                   });
                   ```
                   Apply before calling authService methods:
                   ```ts
                   const result = loginSchema.safeParse({ email, password });
                   if (!result.success) {
                     // map result.error.flatten().fieldErrors to UI
                     return;
                   }
                   await signIn(result.data);
                   ```
      → Fail Mode: Using z.parse() instead of safeParse() throws unhandled exceptions.
                   Always use safeParse() in mutation flows.

15.4. [IMPLEMENT] Disable console output in production builds
      → Input    : babel.config.js
      → Output   : Zero console.log/debug output in production
      → Tool/Cmd : `pnpm add -D babel-plugin-transform-remove-console`
                   Update `babel.config.js`:
                   ```js
                   module.exports = function(api) {
                     api.cache(true);
                     const isProd = process.env.NODE_ENV === 'production';
                     return {
                       presets: ['babel-preset-expo'],
                       plugins: [
                         ['module-resolver', { root: ['./src'], alias: { '@': './src' } }],
                         ...(isProd ? [['transform-remove-console', { exclude: ['error', 'warn'] }]] : [])
                       ]
                     };
                   };
                   ```
      → Fail Mode: NODE_ENV not set to 'production' in EAS build — verify EAS production
                   profile sets this (inherits from Metro default behavior in production builds).

15.5. [VERIFY] Certificate pinning assessment
      → Input    : Supabase domain, app security requirements
      → Output   : Decision: implement or document as accepted risk
      → Tool/Cmd : Evaluate expo-certificate-pinning availability for SDK 55.
                   If available: install and configure for Supabase domain.
                   If unavailable: document in SECURITY.md as accepted risk with
                   rationale (Supabase HTTPS + JWT in SecureStore provides sufficient
                   baseline for most applications).
      → Fail Mode: Pinning breaks on Supabase certificate rotation — if implemented,
                   monitor cert expiry and push OTA update with new pin before rotation.

15.6. [COMMIT] Commit security hardening
      → Input    : All security-related changes
      → Output   : Git commit
      → Tool/Cmd : `git add . && git commit -m "security: SecureStore JWT, Zod v4 validation, console removal"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** No secrets in source. JWT in hardware-backed secure storage. Inputs validated with Zod v4. Console output stripped in production.

**Feedback Gate:** BACK → PHASE 5 if audit finds secrets mismanaged in env config.

---

## PHASE 16: Build Configuration (API 35 + 16KB Compliance + EAS CLI v18)

**Goal:** Configure EAS Build for all profiles, enforcing Android API 35 targeting, NDK r28 for 16KB page size compliance, and EAS CLI v18 minimum.

**Precondition:** Phase 15 complete. EAS authenticated. App identifiers set in Phase 2.3.

---

```
16.1. [UNDERSTAND] 16KB memory page size requirement — mandatory as of 2026
      → Input    : Android 15 compliance documentation
      → Output   : Team alignment on why this cannot be deferred
      → Tool/Cmd : Reference: all new Google Play submissions require 16KB support.
                   Impact on React Native: all compiled C++ .so files (libhermes.so,
                   libreanimated.so, etc.) must be aligned to 16KB page boundaries.
                   Pre-condition satisfied by: Expo SDK 55 (RN 0.83.1 + NDK r28).
                   Expo SDK 55 pre-compiles core shared libraries with 16KB alignment.
                   Third-party native modules with pre-compiled .so files must be
                   audited (Phase 4.2) and confirmed compliant.
      → Fail Mode: Legacy native module with 4KB-aligned .so — Android 15 devices
                   throw fatal UnsatisfiedLinkError on startup. There is no runtime
                   workaround; the library must be recompiled with NDK r28 or replaced.

16.2. [CONFIGURE] eas.json with API 35 targets and EAS CLI v18 constraint
      → Input    : EAS project linked (Phase 2.4)
      → Output   : eas.json with development, preview, and production profiles
      → Tool/Cmd : Edit `eas.json`:
                   ```json
                   {
                     "cli": { "version": ">= 18.0.0" },
                     "build": {
                       "development": {
                         "developmentClient": true,
                         "distribution": "internal",
                         "ios": { "simulator": false },
                         "android": { "buildType": "apk" },
                         "env": { "EXPO_PUBLIC_API_ENV": "development" }
                       },
                       "preview": {
                         "distribution": "internal",
                         "ios": { "simulator": false },
                         "android": { "buildType": "apk" },
                         "env": { "EXPO_PUBLIC_API_ENV": "staging" }
                       },
                       "production": {
                         "distribution": "store",
                         "ios": {},
                         "android": { "buildType": "app-bundle" },
                         "env": { "EXPO_PUBLIC_API_ENV": "production" }
                       }
                     },
                     "submit": {
                       "production": {
                         "ios": {
                           "appleId": "{{APPLE_ID}}",
                           "ascAppId": "{{ASC_APP_ID}}"
                         },
                         "android": {
                           "serviceAccountKeyPath": "./google-play-service-account.json",
                           "track": "production"
                         }
                       }
                     }
                   }
                   ```
     → Fail Mode: cli.version < 18.0.0 causes build mechanism discrepancies between
                  local dev and CI; the --environment flag enforcement (Phase 17/20)
                  requires EAS CLI v18.

16.3. [CONFIGURE] Android build.gradle — API 35 and AGP 9.x
      → Input    : android/build.gradle (Expo Managed projects use config plugin for this)
      → Output   : compileSdkVersion 35, targetSdkVersion 35, AGP 9.x declared
      → Tool/Cmd : In app.json, add android plugin config:
                   ```json
                   "android": {
                     "package": "{{PACKAGE_NAME_ANDROID}}",
                     "compileSdkVersion": 35,
                     "targetSdkVersion": 35,
                     "minSdkVersion": 24
                   }
                   ```
                   Expo SDK 55 manages the underlying Gradle files. Verify effective
                   AGP version in the generated android/build.gradle after prebuild:
                   `npx expo prebuild --platform android --clean`
                   `grep 'com.android.tools.build:gradle' android/build.gradle`
                   # should print 9.x.x
      → Fail Mode: AGP version below 8.5.1 — 16KB zip alignment for uncompressed native
                   libraries is not automatically handled. Expo SDK 55 should pull AGP 9.x;
                   if not, file an issue with the Expo team or pin AGP in build.gradle.

16.4. [VERIFY] NDK r28 is used by EAS cloud runners
      → Input    : EAS build configuration
      → Output   : Confirmed NDK r28 in EAS build environment
      → Tool/Cmd : Expo SDK 55 EAS cloud runners are pre-configured with NDK r28.
                   Verify after first EAS build by inspecting build logs:
                   `eas build:view` → check "NDK version" in build metadata.
                   Local builds: ANDROID_NDK_HOME must point to r28 (Phase 1.7).
      → Fail Mode: Build log shows NDK r26 or earlier — specify NDK version in
                   EAS build profile:
                   `"android": { "buildType": "app-bundle", "ndk": "28.x.x" }`

16.5. [CONFIGURE] iOS code signing — EAS managed
      → Input    : Apple Developer account credentials
      → Output   : Provisioning profiles and certificates managed by EAS cloud
      → Tool/Cmd : `eas credentials --platform ios`
                   Select: let EAS manage all provisioning.
                   EAS prompts for Apple ID and 2FA code.
                   LINUX NOTE: Runs entirely on EAS cloud Mac infrastructure.
      → Fail Mode: Apple 2FA unreachable — must have access to the Apple ID's 2FA
                   device during this step.

16.6. [CONFIGURE] Android keystore — EAS managed + mandatory local backup
      → Input    : EAS project
      → Output   : Keystore stored in EAS; local backup secured
      → Tool/Cmd : `eas credentials --platform android`
                   Select: let EAS generate and store keystore.
                   IMMEDIATELY download backup:
                   `eas credentials --platform android` → "Download keystore"
                   Store securely offline.
                   CRITICAL: Lost keystore = cannot update app on Play Store. No recovery.
      → Fail Mode: Keystore not backed up — this is the single most catastrophic
                   non-recoverable failure in the entire workflow.

16.7. [BUILD] Development client build — Android (local device)
      → Input    : eas.json development profile
      → Output   : Development APK on physical Android device; enables Detox E2E
      → Tool/Cmd : `eas build --profile development --platform android`
                   Download APK from EAS dashboard when complete.
                   `adb install path/to/dev.apk`
                   For local build without EAS queue:
                   `eas build --profile development --platform android --local`
                   (Requires ANDROID_HOME and JAVA_HOME from Phase 1.7.)
      → Fail Mode: Local build fails — check `JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64`.

16.8. [BUILD] Development client build — iOS (EAS cloud)
      → Input    : Apple credentials configured (16.5)
      → Output   : IPA built in EAS cloud; installable via TestFlight link
      → Tool/Cmd : `eas build --profile development --platform ios`
                   `eas build:list`   # monitor status
                   Install on iOS device via QR code link in EAS dashboard.
                   LINUX NOTE: This runs entirely on EAS cloud Mac infrastructure.
      → Fail Mode: Provisioning profile missing device UDID — register UDID in Apple
                   Developer portal, then re-run `eas credentials`.

16.9. [BUILD] Preview build — both platforms
      → Input    : eas.json preview profile, EAS secrets active
      → Output   : Distributable APK + IPA for QA
      → Tool/Cmd : `eas build --profile preview --platform all`
      → Fail Mode: EAS secret not injected — `eas secret:list` must match config.ts keys.

16.10. [COMMIT] Commit build configuration
       → Input    : eas.json
       → Output   : Git commit
       → Tool/Cmd : `git add eas.json && git commit -m "chore: EAS build profiles — API 35, NDK r28, EAS CLI v18"`
                    NEVER commit google-play-service-account.json or credential files.
       → Fail Mode: Credential file accidentally committed — revoke and rotate immediately.
```

**Postcondition:** EAS profiles configured for all environments. API 35 + NDK r28 enforced. 16KB page compliance achieved via SDK 55 + EAS cloud toolchain. Dev builds on both platforms. Keystore backed up.

**Feedback Gate:** BACK → PHASE 2 if bundle ID or package name requires correction.

---

## PHASE 17: CI/CD Pipeline Setup

**Goal:** Automate build, test, and deployment via GitHub Actions + EAS CLI v18, using pnpm in all CI runners, and explicitly targeting EAS environments with `--environment` flag.

**Precondition:** Phase 16 complete. Code in GitHub. EAS secrets configured. EXPO_TOKEN created.

---

```
17.1. [CREATE] GitHub Actions CI workflow (PR testing)
      → Input    : .github/workflows/ directory
      → Output   : .github/workflows/ci.yml — runs on every PR to main/develop
      → Tool/Cmd : Create `.github/workflows/ci.yml`:
                   ```yaml
                   name: CI
                   on:
                     pull_request:
                       branches: [main, develop]
                   jobs:
                     test:
                       runs-on: ubuntu-latest
                       steps:
                         - uses: actions/checkout@v4
                         - uses: pnpm/action-setup@v3
                           with:
                             version: '10'
                         - uses: actions/setup-node@v4
                           with:
                             node-version: '24'
                             cache: 'pnpm'
                         - run: pnpm install --frozen-lockfile
                         - run: pnpm exec eslint src/
                         - run: pnpm exec tsc --noEmit
                         - run: pnpm test --ci --coverage
                   ```
     → Fail Mode: Using npm ci instead of pnpm — npm cannot read pnpm-lock.yaml;
                  pnpm/action-setup must precede setup-node.
                  Node 24 not available on runner — actions/setup-node v4 supports it.

17.2. [CREATE] EAS production build on merge to main
      → Input    : EXPO_TOKEN in GitHub repository secrets
      → Output   : .github/workflows/eas-build.yml
      → Tool/Cmd : Generate EXPO_TOKEN:
                   https://expo.dev/accounts/{{EAS_ACCOUNT}}/settings/access-tokens
                   Add to GitHub: Settings → Secrets → EXPO_TOKEN
                   Create `.github/workflows/eas-build.yml`:
                   ```yaml
                   name: EAS Build
                   on:
                     push:
                       branches: [main]
                   jobs:
                     build:
                       runs-on: ubuntu-latest
                       steps:
                         - uses: actions/checkout@v4
                         - uses: pnpm/action-setup@v3
                           with:
                             version: '10'
                         - uses: actions/setup-node@v4
                           with:
                             node-version: '24'
                             cache: 'pnpm'
                         - uses: expo/expo-github-action@v8
                           with:
                             eas-version: '>= 18.0.0'
                             token: ${{ secrets.EXPO_TOKEN }}
                         - run: pnpm install --frozen-lockfile
                         - run: eas build --profile production --platform all --non-interactive
                   ```
      → Fail Mode: EAS free tier queue — production builds may queue. Schedule off-peak
                   or upgrade EAS plan.

17.3. [CREATE] EAS submit after successful production build
      → Input    : Completed production EAS build
      → Output   : .github/workflows/eas-submit.yml
      → Tool/Cmd : Create `.github/workflows/eas-submit.yml`:
                   ```yaml
                   name: EAS Submit
                   on:
                     workflow_run:
                       workflows: ["EAS Build"]
                       types: [completed]
                   jobs:
                     submit:
                       if: ${{ github.event.workflow_run.conclusion == 'success' }}
                       runs-on: ubuntu-latest
                       steps:
                         - uses: actions/checkout@v4
                         - uses: expo/expo-github-action@v8
                           with:
                             eas-version: '>= 18.0.0'
                             token: ${{ secrets.EXPO_TOKEN }}
                         - run: eas submit --platform all --non-interactive --latest
                   ```
      → Fail Mode: Google Play service account JSON not in EAS secrets — configure as
                   EAS secret, never commit the file.

17.4. [CONFIGURE] Branch strategy and environment mapping
      → Input    : Git branching model
      → Output   : Documented in README.md
      → Tool/Cmd : Document:
                   `feature/*` → PR → CI (lint + typecheck + tests)
                   `develop`   → merge → EAS preview build (internal QA)
                   `main`      → merge → EAS production build + submit
                   Enable branch protection on main: require PR + CI pass.
      → Fail Mode: No branch protection allows direct push to main, bypassing CI.

17.5. [VERIFY] Push test PR; confirm CI passes
      → Input    : Feature branch with passing tests
      → Output   : GitHub Actions CI green
      → Tool/Cmd : `git checkout -b test/ci-verification`
                   Make trivial change, push, open PR, monitor Actions tab.
      → Fail Mode: Typecheck fails — fix TS errors; do NOT add @ts-ignore.

17.6. [COMMIT] Commit CI/CD configuration
      → Input    : .github/workflows/*.yml
      → Output   : Git commit
      → Tool/Cmd : `git add .github/ && git commit -m "ci: GitHub Actions + EAS CLI v18 build and submit workflows"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** CI on every PR. EAS production build on main merge using pnpm + Node 24 + EAS CLI v18. EAS submit triggers after successful build.

**Feedback Gate:** BACK → PHASE 16 if EAS build fails in CI.

---

## PHASE 18: Pre-release QA & Beta Distribution

**Goal:** Distribute to TestFlight and Play Internal Testing, perform structured QA, and resolve all P1/P2 bugs before public submission.

**Precondition:** Phase 17 complete. Production EAS build successful.

---

```
18.1. [CONFIGURE] Create App Store Connect app record
      → Input    : Apple Developer account (paid, $99/year)
      → Output   : App record with {{BUNDLE_ID_IOS}}
      → Tool/Cmd : https://appstoreconnect.apple.com → Apps → + → New App
                   Bundle ID: {{BUNDLE_ID_IOS}} (exact match to eas.json)
      → Fail Mode: Bundle ID already taken — change in Phase 2.3 and rebuild.
                   Cannot change after submission.

18.2. [DISTRIBUTE] Submit iOS build to TestFlight
      → Input    : Production iOS EAS build
      → Output   : Build in TestFlight for internal testers
      → Tool/Cmd : `eas submit --platform ios --latest`
                   OR triggered via Phase 17.3 workflow.
                   App Store Connect → TestFlight → Internal Testing → Add build.
      → Fail Mode: Export compliance question — select "No" unless custom crypto
                   beyond standard HTTPS is used.

18.3. [CONFIGURE] Create Play Console app
      → Input    : Google Play Developer account ($25 one-time)
      → Output   : App created with {{PACKAGE_NAME_ANDROID}}
      → Tool/Cmd : https://play.google.com/console → Create App
      → Fail Mode: Package name taken — change in Phase 2.3 and rebuild.

18.4. [DISTRIBUTE] Submit Android AAB to Play Internal Testing
      → Input    : Production AAB from EAS
      → Output   : Build in Internal Testing track
      → Tool/Cmd : `eas submit --platform android --latest`
                   Play Console → Testing → Internal Testing → Create release.
      → Fail Mode: Service account missing "Release Manager" role in Play Console.

18.5. [TEST] Structured QA checklist on physical devices
      → Input    : Beta builds on TestFlight (iOS device) and Internal Testing (Android device)
      → Output   : Bug report, severity-classified
      → Tool/Cmd : Test systematically:
                   AUTH:        Register, Login, Session persistence, Password reset
                   CORE FLOWS:  All primary user journeys end-to-end
                   OFFLINE:     Airplane mode — cached data visible, mutation error graceful
                   PERFORMANCE: Cold start <3s, scroll 60fps, no ANR
                   A11Y:        TalkBack (Android), VoiceOver (iOS — requires iOS device)
                   EDGE CASES:  Empty states, error states, network timeout
                   DEEP LINKS:  {{APP_SCHEME}}:// URLs open correct screen
                   16KB COMPAT: Test on an Android 15 device specifically to validate
                                no UnsatisfiedLinkError on app launch
      → Fail Mode: Crash on Android 15 at startup — 4KB-aligned .so from a third-party
                   library; identify via logcat: `adb logcat | grep UnsatisfiedLinkError`.
                   BACK → PHASE 4 to replace the offending library.

18.6. [RESOLVE] Fix all P1 (crash) and P2 (broken core flow) bugs
      → Input    : QA bug report
      → Output   : Zero P1/P2 bugs; new EAS build
      → Tool/Cmd : Per bug: branch → fix → PR → CI pass → merge → new EAS build.
                   Increment version and build numbers in app.json.
      → Fail Mode: Build number not incremented — stores reject re-submissions with
                   identical build numbers.

18.7. [TAG] Tag release candidate
      → Input    : Main branch with P1/P2 fixes merged
      → Output   : Git tag
      → Tool/Cmd : `git tag -a v1.0.0 -m "Release candidate 1.0.0"`
                   `git push origin v1.0.0`
      → Fail Mode: Wrong commit tagged — `git tag -d v1.0.0 && git push origin :v1.0.0`.
```

**Postcondition:** Beta builds distributed. QA complete with zero P1/P2. 16KB compliance confirmed on Android 15 device. Release candidate tagged.

**Feedback Gate:** BACK → PHASE 16 for build config issues; BACK → PHASE 4 for 16KB library compliance failures.

---

## PHASE 19: App Store Submission

**Goal:** Submit the production build to both stores with complete metadata, privacy declarations, and compliance requirements.

**Precondition:** Phase 18 complete. Zero P1/P2 bugs.

---

```
19.1. [PREPARE] iOS screenshots
      → Input    : Physical iOS device or design tool
      → Output   : Screenshots at all required sizes
      → Tool/Cmd : Required sizes (Apple 2026):
                   6.9" (iPhone 16 Pro Max): 1320×2868
                   6.7" (iPhone 16 Plus):    1290×2796
                   6.5" (iPhone 11 Pro Max): 1242×2688
                   LINUX NOTE: Capture on physical iOS device, or create device-framed
                   screenshots using Figma/design tool from actual device photos.
      → Fail Mode: Wrong dimensions — App Store Connect rejects with exact size requirement.

19.2. [PREPARE] Android screenshots and graphics
      → Input    : Physical Android device
      → Output   : Screenshots + feature graphic (1024×500) + icon (512×512)
      → Tool/Cmd : `adb shell screencap -p /sdcard/screen.png && adb pull /sdcard/screen.png`
                   Feature graphic: create 1024×500 PNG (mandatory for Play listing).
                   Icon: 512×512 PNG, no transparency.
      → Fail Mode: Other platform logos in device frames — use neutral frames only.

19.3. [PREPARE] Store listing copy
      → Input    : App description, keywords
      → Output   : store-listing.md
      → Tool/Cmd : Document: App name (30 chars iOS/50 Android), subtitle, description,
                   keywords, category, age rating, support URL, privacy policy URL.
                   Privacy policy URL: MANDATORY for both stores; must be live and reachable.
      → Fail Mode: Privacy policy URL dead/404 — automatic rejection by Apple and Google.

19.4. [CONFIGURE] App Store Connect — complete all metadata
      → Input    : store-listing.md, screenshots
      → Output   : All fields complete including App Privacy questionnaire
      → Tool/Cmd : Fill: App Information, Pricing, Screenshots, App Review Information,
                   App Privacy (Data practices — legally binding).
                   Disclose: email collection (Supabase Auth), auth tokens.
      → Fail Mode: Misrepresented data practices — grounds for removal, not just rejection.

19.5. [CONFIGURE] Play Console — complete all metadata and policies
      → Input    : store-listing.md, screenshots, feature graphic
      → Output   : Listing complete; Data Safety form submitted
      → Tool/Cmd : Fill: Description, Screenshots, Feature graphic, Icon.
                   Complete: Data safety form (email, auth data), Content rating,
                   Target audience, Ads declaration.
      → Fail Mode: Incomplete data safety form — Play blocks release until complete.

19.6. [SUBMIT] iOS to App Store Review
      → Input    : Production build in TestFlight, metadata complete
      → Output   : Under Apple review
      → Tool/Cmd : App Store Connect → App Store → + Version → Select TestFlight build
                   → Submit for Review → Answer export compliance.
                   Review time: 24–72 hours (first submission may be longer).
      → Fail Mode: Rejected — read Resolution Center carefully. Common: missing privacy
                   policy, placeholder content, crashes on review device, metadata mismatch.

19.7. [SUBMIT] Android to Google Play Review
      → Input    : AAB in Internal Testing, metadata complete
      → Output   : Under Play review
      → Tool/Cmd : Play Console → Internal Testing → Promote to Production
                   Staged rollout: start at 10–20%.
                   Review time: hours to 3 days for new apps.
      → Fail Mode: Policy violation — read Play Console email. Common: missing privacy
                   policy, excessive permissions, misleading metadata.

19.8. [MONITOR] Track review until both approved
      → Input    : App Store Connect and Play Console dashboards
      → Output   : Both platforms live
      → Tool/Cmd : Check daily. Apple sends email on status change.
      → Fail Mode: >7 day review — contact Apple/Google developer support.
```

**Postcondition:** Submitted to both stores. Metadata, screenshots, privacy policy, and data declarations complete and accurate.

**Feedback Gate:** BACK → PHASE 18 if review reveals a bug requiring a new build; increment version + build number before resubmitting.

---

## PHASE 20: Post-deployment Monitoring & Maintenance

**Goal:** Establish crash reporting via @sentry/react-native (not deprecated sentry-expo), OTA updates with EAS CLI v18 `--environment` flag, and structured maintenance cadence.

**Precondition:** Phase 19 complete. App live on both stores.

---

```
20.1. [INSTALL] Integrate @sentry/react-native directly (sentry-expo is deprecated)
      → Input    : Sentry account (sentry.io — free tier available)
      → Output   : Crash reports from production users in Sentry dashboard
      → Tool/Cmd : `pnpm add @sentry/react-native`
                   `npx @sentry/wizard@latest -i reactNative`
                   # The wizard configures app.json plugin AND metro.config.js automatically.
                   Verify app.json has the @sentry/react-native/expo plugin, NOT sentry-expo:
                   ```json
                   "plugins": [
                     ["@sentry/react-native/expo", {
                       "organization": "{{SENTRY_ORG}}",
                       "project": "{{SENTRY_PROJECT}}"
                     }]
                   ]
                   ```
                   Verify metro.config.js wraps the Expo config:
                   ```js
                   const { getSentryExpoConfig } = require('@sentry/react-native/metro');
                   const config = getSentryExpoConfig(__dirname);
                   module.exports = config;
                   ```
                   Initialize in src/app/_layout.tsx:
                   ```ts
                   import * as Sentry from '@sentry/react-native';
                   Sentry.init({
                     dsn: '{{SENTRY_DSN}}',
                     enableInExpoDevelopment: false,
                     tracesSampleRate: 0.2,
                   });
                   ```
                   Add SENTRY_DSN to EAS secrets (Phase 5.4 pattern).
      → Fail Mode: Using sentry-expo — this package is deprecated since SDK 50 (Jan 2024),
                   receives no security patches, and is incompatible with SDK 55.
                   It must not be installed.
      → NOTE: The metro.config.js wrapper using getSentryExpoConfig is MANDATORY.
              Without it, Hermes bytecode sourcemaps are not uploaded to Sentry,
              resulting in minified/unreadable stack traces in all crash reports.
              This wrapper ensures sourcemaps generated during EAS cloud builds are
              automatically uploaded to the Sentry dashboard.

20.2. [CONFIGURE] Sentry alert thresholds
      → Input    : Sentry project
      → Output   : Alerts on crash rate spikes and new issues
      → Tool/Cmd : Sentry → Alerts → Create Alert Rule:
                   Rule 1: Crash-free sessions < 99% → email/Slack notification
                   Rule 2: New issue > 10 events in 1 hour → immediate notification
      → Fail Mode: Alert not firing — verify Sentry SDK initializes before first render
                   and SENTRY_DSN is correctly injected in production build.

20.3. [CONFIGURE] EAS Update for OTA hotfixes — with --environment flag (EAS CLI v18)
      → Input    : EAS CLI v18, expo-updates installed
      → Output   : OTA JS-only hotfixes deliverable without store review
      → Tool/Cmd : `npx expo install expo-updates`
                   `eas update:configure`
                   To push a hotfix to production:
                   `eas update --branch production --message "fix: critical bug" --environment production`
                   The --environment flag is REQUIRED in EAS CLI v18 for SDK 55 projects.
                   Omitting it causes the CLI to reject the command or default unexpectedly.
      → Fail Mode: Missing --environment flag — EAS CLI v18 enforces this; command fails.
                   OTA too large (>50MB) — SDK 55 with Hermes bytecode diffing reduces
                   payload by up to 75% vs full bundle; payloads this large are unlikely
                   in practice, but if encountered, split into incremental updates.
      → SCOPE: OTA updates apply to JavaScript and assets ONLY. Any change requiring
               a new native module or native code modification requires a full EAS build
               and store submission.

20.4. [ESTABLISH] Release cadence and version strategy
      → Input    : Project roadmap
      → Output   : CONTRIBUTING.md with documented release process
      → Tool/Cmd : Document:
                   Hotfixes: `eas update --environment production` (JS-only)
                   Patch (x.x.N): bug fixes requiring native rebuild → store submission
                   Minor (x.N.0): new features → full QA cycle (Phase 18)
                   Major (N.0.0): breaking changes → extended QA + phased rollout
                   Increment `version` in app.json per semver.
                   Increment buildNumber (iOS) and versionCode (Android) on every build.
      → Fail Mode: Undocumented cadence leads to ad-hoc releases and inconsistent
                   build number management.

20.5. [MONITOR] Track app store ratings and user reviews
      → Input    : Live apps
      → Output   : Timely response to negative reviews; user-reported bugs triaged
      → Tool/Cmd : App Store Connect → Ratings & Reviews (enable email notifications).
                   Play Console → Ratings & Reviews → Reply.
                   Target: respond to 1–2 star reviews within 48 hours.
      → Fail Mode: Reproducible bug from reviews unaddressed — prioritize fix, deploy
                   patch, update review response when fix ships.

20.6. [MAINTAIN] Monthly dependency updates
      → Input    : Running production app
      → Output   : Dependencies current; no unpatched vulnerabilities
      → Tool/Cmd : Monthly: `pnpm outdated` → review and test updates
                   `pnpm audit` → patch critical/high immediately
                   Expo SDK major upgrades: follow
                   https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/
                   Never upgrade Expo SDK without full regression test (Phase 12).
      → Fail Mode: Skipping SDK upgrades leads to deprecated API warnings becoming
                   hard blockers when Apple/Google update OS requirements.

20.7. [MAINTAIN] Supabase project health
      → Input    : Supabase dashboard
      → Output   : DB performance, quota, JWT behavior monitored
      → Tool/Cmd : Supabase → Reports → API requests, slow queries, DB size.
                   Monitor JWT refresh: access tokens expire in 1 hour; confirm
                   autoRefreshToken: true is functioning in production (check Sentry
                   for auth-related errors post-deploy).
      → Fail Mode: Free tier DB quota (500MB) exceeded — optimize queries, purge old
                   data, or upgrade before data loss occurs.
```

**Postcondition:** @sentry/react-native active with getSentryExpoConfig Metro wrapper — stack traces resolve correctly. OTA updates use `--environment` flag. Release cadence documented.

**Feedback Gate:** BACK → any prior phase if monitoring reveals systemic issues (auth bugs → Phase 9; 16KB crashes → Phase 4/16; performance regressions → Phase 13).

---

## SUMMARY: ALL VARIABLE SLOTS

```
{{APP_NAME}}                 — Application display name
{{APP_NAME_SLUG}}            — URL-safe lowercase slug (e.g., my-app)
{{APP_SCHEME}}               — Deep link URI scheme (e.g., myapp)
{{BUNDLE_ID_IOS}}            — iOS bundle ID (e.g., com.company.myapp) — IRREVERSIBLE
{{PACKAGE_NAME_ANDROID}}     — Android package name — IRREVERSIBLE
{{SUPABASE_URL}}             — Supabase project URL from project settings
{{SUPABASE_ANON_KEY}}        — Supabase anon/public key from project settings
{{SUPABASE_PROJECT_ID}}      — Supabase project ID (from dashboard URL)
{{EAS_ACCOUNT}}              — Expo account slug
{{REMOTE_REPO_URL}}          — Git remote origin URL
{{TABLE_NAME}}               — Supabase table name for data hooks
{{APPLE_ID}}                 — Apple Developer account email
{{ASC_APP_ID}}               — App Store Connect numeric app ID
{{TEST_USER_EMAIL}}          — E2E test account email in Supabase Auth
{{TEST_USER_PASSWORD}}       — E2E test account password
{{SENTRY_ORG}}               — Sentry organization slug
{{SENTRY_PROJECT}}           — Sentry project name
{{SENTRY_DSN}}               — Sentry data source name URL
{{APP_LANGUAGE}}             — Primary language (e.g., en-US)
{{APP_SKU}}                  — Unique internal SKU for App Store Connect
{{MONETIZATION_MODEL}}       — Free or Paid (Play Console)
```

---

## AUDIT CORRECTION SUMMARY TABLE

| Category | v1 Specification | v2 Corrected | Phase(s) Affected |
|---|---|---|---|
| Node.js runtime | Generic LTS | Node.js 24 LTS | 1, 17 |
| NVM version | v0.39.7 | v0.40.4 | 1 |
| pnpm version | Generic v10 | v10.32.0; allowBuilds config | 1, 4 |
| Android SDK | API 34 | API 35 (mandatory Aug 2025) | 1, 16 |
| NDK version | Unspecified | r28 (16KB page compliance) | 1, 16 |
| AGP version | Unspecified | 9.x (via SDK 55) | 16 |
| Expo SDK | Unspecified | SDK 55 (RN 0.83.1, React 19.2) | 2, all |
| New Architecture | Optional flag | Enforced; no opt-out | 2, 4, 8 |
| React Compiler | Manual memo | Compiler-automated; manual removed | 8, 13 |
| Navigation tabs | `<Tabs>` (JS) | `<NativeTabs>` (native platform API) | 6 |
| Expo Router | v3/v4 | v7 | 4, 6 |
| TanStack Query | v4/v5 generic | v5.90.x; no onSuccess on useQuery | 7, 10 |
| Zustand | v4/v5 generic | v5.0.11; named exports; useShallow | 7, 11 |
| Zod | v3 | v4 | 4, 15 |
| Supabase schema gen | Anon key | CLI with PAT (anon deprecated Mar 2026) | 10 |
| Crash reporting | sentry-expo | @sentry/react-native + Metro wrapper | 4, 20 |
| EAS CLI | Generic | v18.1.0; >=18.0.0 constraint | 1, 4, 16, 17, 20 |
| EAS update | No flag | --environment flag mandatory (CLI v18) | 20 |
| CI package manager | npm ci | pnpm + pnpm/action-setup@v3 | 17 |
| iOS E2E testing | Deferred | macOS GitHub Actions runner workflow | 12, 17 |

---

## LINUX-SPECIFIC CONSTRAINT SUMMARY (UNCHANGED)

| Concern | Linux Limitation | Resolution |
|---|---|---|
| iOS builds | No Xcode | EAS Build (cloud) — mandatory |
| iOS simulator | Not available | Physical iOS device + Expo Go |
| iOS E2E (Detox) | No iOS simulator | macOS GitHub Actions runner (Phase 12.6) |
| Android local build | Fully supported | Android Studio + adb |
| Android emulator | RAM-constrained (12GB) | Physical Android device preferred |
| Code signing (iOS) | No Keychain | EAS Credentials management |
| Screenshots (iOS) | No Simulator | Physical device capture or design tool |
