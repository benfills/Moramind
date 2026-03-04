# React Native Build & Deploy Workflow
## Complete 20-Phase Execution Document

---

## WORKFLOW MANIFEST

```
App Target     : Both (iOS + Android)
State Manager  : TanStack Query (server state) + Zustand (client/UI state)
Backend Type   : Supabase (PostgreSQL + Auth + Realtime + Storage)
Auth Strategy  : JWT via Supabase Auth
Deploy Target  : Public App Stores — iOS App Store + Google Play
RN Mode        : Expo Managed Workflow
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
- Android local builds are possible but the emulator will be RAM-constrained (12 GiB total).
- Prefer a **physical Android device** for development iteration. Use `adb` over USB.
- iOS simulator is **unavailable** on Linux. Use **Expo Go on a physical iOS device** for
  pre-EAS development, then EAS builds for TestFlight/App Store validation.

---

### Phase Dependency Graph (ASCII DAG)

```
[1: Env Setup]
      │
      ▼
[2: Project Init]
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
[6: Navigation Architecture]                                  │
      │                                                       │
      ▼                                                       │
[7: State Mgmt Setup (TanStack + Zustand)]                   │
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
[16: Build Configuration (iOS & Android via EAS)]
      │
      ▼
[17: CI/CD Pipeline Setup]
      │
      ▼
[18: Pre-release QA & Beta Distribution]
      │
      ▼
[19: App Store Submission]
      │
      ▼
[20: Post-deployment Monitoring & Maintenance]

Feedback paths: 12→8, 13→4, 18→16, 19→18, 20→any
```

---

## PHASE 1: Environment Setup

**Goal:** Establish a fully verified, reproducible development environment on Linux capable of running Expo, EAS CLI, Android tooling, and Node.js without version conflicts.

**Precondition:** Fresh or existing Linux install with internet access, `sudo` privileges, and `bash` or `zsh` shell available.

---

```
1.1. [VERIFY] Confirm Linux kernel and distro version
     → Input    : Running Linux system
     → Output   : Confirmed OS string (e.g., Ubuntu 22.04 / Debian 12)
     → Tool/Cmd : `uname -a && cat /etc/os-release`
     → Fail Mode: Unsupported distro — verify package manager (apt/dnf/pacman)
                  before continuing; workflow assumes apt.

1.2. [INSTALL] Install Node.js via nvm (Node Version Manager)
     → Input    : Internet access, bash/zsh 
     → Output   : nvm installed, Node.js LTS active
     → Tool/Cmd : `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
                  `source ~/.bashrc` (or ~/.zshrc)
                  `nvm install --lts`
                  `nvm use --lts`
                  `node -v && npm -v`
     → Fail Mode: curl blocked — download install.sh manually and execute.
                  nvm not found after source — add nvm init lines to shell rc manually.

1.3. [INSTALL] Install pnpm (preferred package manager for monorepo hygiene)
     → Input    : Node.js LTS active
     → Output   : pnpm available globally
     → Tool/Cmd : `npm install -g pnpm`
                  `pnpm -v`
     → Fail Mode: Permission error — prefix with `sudo` only if nvm is NOT in use;
                  with nvm, global installs should not require sudo.

1.4. [INSTALL] Install Expo CLI and EAS CLI globally
     → Input    : Node.js + pnpm active
     → Output   : `expo` and `eas` commands available
     → Tool/Cmd : `npm install -g expo-cli eas-cli`
                  `expo --version && eas --version`
     → Fail Mode: Version mismatch with local project — pin versions in project
                  devDependencies instead; use `npx expo` and `npx eas` as fallback.

1.5. [INSTALL] Install Java Development Kit (JDK) for Android tooling
     → Input    : apt package manager available
     → Output   : JDK 17 installed (required by current Android Gradle)
     → Tool/Cmd : `sudo apt update && sudo apt install -y openjdk-17-jdk`
                  `java -version`
     → Fail Mode: Wrong Java version — set JAVA_HOME explicitly:
                  `export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64`
                  Add to ~/.bashrc.

1.6. [INSTALL] Install Android Studio (includes SDK + emulator)
     → Input    : ~8 GB disk space available in Linux partition (165 GB root confirmed)
     → Output   : Android Studio installed, Android SDK available
     → Tool/Cmd : Download from https://developer.android.com/studio
                  Extract to ~/android-studio
                  `sudo apt install -y libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1`
                  Launch: `~/android-studio/bin/studio.sh`
                  Via SDK Manager: install Android 14 (API 34) SDK + Build Tools 34.x
     → Fail Mode: Missing 32-bit libs — install via apt as above.
                  Emulator slow on 12 GiB RAM — use physical Android device instead (preferred).

1.7. [CONFIGURE] Set Android environment variables
     → Input    : Android SDK installed
     → Output   : ANDROID_HOME and PATH updated
     → Tool/Cmd : Add to ~/.bashrc:
                  `export ANDROID_HOME=$HOME/Android/Sdk`
                  `export PATH=$PATH:$ANDROID_HOME/emulator`
                  `export PATH=$PATH:$ANDROID_HOME/platform-tools`
                  `source ~/.bashrc`
                  `adb --version`
     → Fail Mode: adb not found — verify SDK path with `ls $ANDROID_HOME`.

1.8. [VERIFY] Connect physical Android device for development
     → Input    : Android device with USB debugging enabled
     → Output   : Device visible to adb
     → Tool/Cmd : Enable USB debugging on device (Settings → Developer Options)
                  `adb devices`  — device should appear as "device" not "unauthorized"
     → Fail Mode: "unauthorized" — accept RSA prompt on device screen.
                  Device not listed — try different USB cable or port; check `dmesg | tail`.

1.9. [LOGIN] Authenticate with Expo / EAS account
     → Input    : Expo account credentials (create at expo.dev if needed)
     → Output   : Logged-in session on this machine
     → Tool/Cmd : `eas login`
                  `eas whoami`
     → Fail Mode: Login fails — check network; corporate firewall may block expo.dev.

1.10. [VERIFY] Confirm no version conflicts
      → Input    : All tools installed
      → Output   : Clean version report
      → Tool/Cmd : `node -v && pnpm -v && expo --version && eas --version && java -version && adb --version`
      → Fail Mode: Any missing — revisit corresponding install step above.
```

**Postcondition:** Node LTS, pnpm, Expo CLI, EAS CLI, JDK 17, Android SDK, and adb are all verified operational on Linux. EAS account is authenticated.

**Feedback Gate:** BACK → PHASE 1 if any Phase 2 scaffold command fails due to missing CLI tools.

---

## PHASE 2: Project Initialization

**Goal:** Scaffold a new Expo-managed React Native project with correct identity, linked to EAS, and committed to version control.

**Precondition:** Phase 1 complete. Git installed (`git --version`). GitHub/GitLab repo created (empty).

---

```
2.1. [SCAFFOLD] Create new Expo project from blank TypeScript template
     → Input    : {{APP_NAME}}, working directory of choice
     → Output   : Project directory with initial Expo structure
     → Tool/Cmd : `npx create-expo-app {{APP_NAME}} --template blank-typescript`
                  `cd {{APP_NAME}}`
     → Fail Mode: Template fetch fails — check network; retry with `--no-install`
                  flag then run `pnpm install` manually.

2.2. [CONFIGURE] Set app name, slug, and version in app.json
     → Input    : app.json generated by scaffold
     → Output   : Correct identity fields set
     → Tool/Cmd : Edit `app.json`:
                  `"name": "{{APP_NAME}}"`
                  `"slug": "{{APP_NAME_SLUG: url-safe lowercase slug}}"`
                  `"version": "1.0.0"`
                  `"orientation": "portrait"` (or "default")
                  `"scheme": "{{APP_SCHEME: deep link URI scheme, e.g. myapp}}"`
     → Fail Mode: Invalid slug (spaces, uppercase) breaks EAS — use lowercase-hyphenated only.

2.3. [CONFIGURE] Set iOS bundle identifier and Android package name in app.json
     → Input    : {{BUNDLE_ID_IOS}}, {{PACKAGE_NAME_ANDROID}}
     → Output   : Platform-specific identifiers registered
     → Tool/Cmd : In app.json under `"expo"`:
                  `"ios": { "bundleIdentifier": "{{BUNDLE_ID_IOS}}" }`
                  `"android": { "package": "{{PACKAGE_NAME_ANDROID}}" }`
     → Fail Mode: Mismatched IDs later cause EAS provisioning failures —
                  these CANNOT be changed after App Store submission without re-listing.

2.4. [INIT] Initialize EAS project and link to Expo account
     → Input    : Authenticated EAS session (Phase 1.9), app.json configured
     → Output   : eas.json created, project linked to EAS dashboard
     → Tool/Cmd : `eas init`
                  Select or confirm project name when prompted.
                  `cat eas.json`
     → Fail Mode: "Project not found" — ensure `eas login` session is active.

2.5. [INIT] Initialize Git repository and make first commit
     → Input    : Scaffolded project directory
     → Output   : Git repo with initial commit
     → Tool/Cmd : `git init`
                  `git add .`
                  `git commit -m "chore: initial Expo project scaffold"`
     → Fail Mode: git not installed — `sudo apt install -y git`.

2.6. [CONFIGURE] Add remote origin and push
     → Input    : Remote repo URL (GitHub/GitLab)
     → Output   : Code pushed to remote
     → Tool/Cmd : `git remote add origin {{REMOTE_REPO_URL}}`
                  `git branch -M main`
                  `git push -u origin main`
     → Fail Mode: Auth failure — configure SSH key or HTTPS credential helper.

2.7. [VERIFY] Confirm Expo dev server starts cleanly
     → Input    : Project directory, Android device connected (adb devices)
     → Output   : Metro bundler running, QR code visible
     → Tool/Cmd : `npx expo start`
                  Press `a` to open on connected Android device, or scan QR with
                  Expo Go on physical iOS device.
     → Fail Mode: Metro fails to start — check for port 8081 conflict: `lsof -i :8081`.
                  iOS device can't connect — ensure device and machine on same Wi-Fi,
                  or use `--tunnel` flag (requires @expo/ngrok).
```

**Postcondition:** Project is scaffolded, EAS-linked, version-controlled, and confirmed to run on at least one physical device.

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
     → Fail Mode: Naming conflicts with Expo Router conventions — if using Expo Router,
                  `src/app/` IS the router root; adjust accordingly (see Phase 6).

3.2. [CREATE] Define module boundary conventions (document in README)
     → Input    : Architecture decision
     → Output   : `ARCHITECTURE.md` at project root
     → Tool/Cmd : Create `ARCHITECTURE.md` with the following module map:
                  src/app/          — Expo Router file-based routes (screens)
                  src/components/   — Reusable, stateless UI primitives
                  src/screens/      — Full screen compositions (if not using Expo Router)
                  src/navigation/   — Navigation config (if using React Navigation)
                  src/hooks/        — Custom React hooks (including TanStack Query hooks)
                  src/store/        — Zustand stores
                  src/services/     — Supabase client, API abstraction layer
                  src/lib/          — Third-party library configuration (queryClient, etc.)
                  src/types/        — TypeScript interfaces and type definitions
                  src/utils/        — Pure utility functions (no side effects)
                  src/constants/    — App-wide constants (colors, routes, config keys)
                  src/i18n/         — i18next locale files and config
                  src/assets/       — Images, fonts, icons
     → Fail Mode: No hard failure; lack of documented conventions causes drift at scale.

3.3. [CREATE] Add TypeScript path aliases to tsconfig.json
     → Input    : tsconfig.json from scaffold
     → Output   : `@/` alias resolves to `src/`
     → Tool/Cmd : Edit `tsconfig.json`:
                  ```json
                  {
                    "extends": "expo/tsconfig.base",
                    "compilerOptions": {
                      "strict": true,
                      "baseUrl": ".",
                      "paths": {
                        "@/*": ["src/*"]
                      }
                    }
                  }
                  ```
                  Install resolver: `pnpm add -D babel-plugin-module-resolver`
                  Edit `babel.config.js`:
                  ```js
                  module.exports = function(api) {
                    api.cache(true);
                    return {
                      presets: ['babel-preset-expo'],
                      plugins: [
                        ['module-resolver', {
                          root: ['./src'],
                          alias: { '@': './src' }
                        }]
                      ]
                    };
                  };
                  ```
     → Fail Mode: Alias not resolving at runtime — ensure babel plugin is present AND
                  Metro cache is cleared: `npx expo start --clear`.

3.4. [COMMIT] Commit directory structure and config
     → Input    : All changes from 3.1–3.3
     → Output   : Git commit
     → Tool/Cmd : `git add . && git commit -m "chore: establish directory structure and TS path aliases"`
     → Fail Mode: Git unclean state — check `git status` and stage explicitly.
```

**Postcondition:** Directory tree exists, module responsibilities are documented, TypeScript aliases resolve correctly, and Metro starts without errors.

**Feedback Gate:** BACK → PHASE 3 if Phase 6 (Navigation) reveals that Expo Router requires restructuring the `src/app/` directory.

---

## PHASE 4: Dependency Management

**Goal:** Install, pin, and audit all project dependencies — production and development — with no unresolved peer conflicts.

**Precondition:** Phase 3 complete. `package.json` exists.

---

```
4.1. [INSTALL] Core Expo and React Native dependencies (already in scaffold — verify)
     → Input    : package.json from scaffold
     → Output   : Confirmed: expo, react, react-native at correct versions
     → Tool/Cmd : `cat package.json | grep -E '"expo"|"react"'`
                  `pnpm install` (to ensure lockfile is generated)
     → Fail Mode: Peer conflict on install — use `pnpm install --no-strict-peer-dependencies`
                  as temporary measure; resolve root cause before Phase 16.

4.2. [INSTALL] Navigation — Expo Router (file-based, recommended for Expo Managed)
     → Input    : Project root
     → Output   : expo-router installed
     → Tool/Cmd : `npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar`
     → Fail Mode: Version incompatibilities with current Expo SDK — check
                  https://docs.expo.dev/router/installation/ for SDK-matched versions.

4.3. [INSTALL] Supabase client and dependencies
     → Input    : Project root
     → Output   : @supabase/supabase-js installed with required polyfills
     → Tool/Cmd : `pnpm add @supabase/supabase-js`
                  `npx expo install @react-native-async-storage/async-storage`
                  `pnpm add react-native-url-polyfill`
     → Fail Mode: Missing AsyncStorage polyfill causes Supabase Auth session persistence
                  to fail silently — both packages are mandatory.

4.4. [INSTALL] TanStack Query (server state)
     → Input    : Project root
     → Output   : @tanstack/react-query installed
     → Tool/Cmd : `pnpm add @tanstack/react-query`
                  `pnpm add -D @tanstack/eslint-plugin-query`
     → Fail Mode: React version mismatch — TanStack Query v5 requires React 18+;
                  verify with `cat node_modules/react/package.json | grep '"version"'`.

4.5. [INSTALL] Zustand (client/UI state)
     → Input    : Project root
     → Output   : zustand installed
     → Tool/Cmd : `pnpm add zustand`
     → Fail Mode: No known peer issues; if TypeScript types missing add `@types/zustand`
                  (though Zustand ships its own types in v4+).

4.6. [INSTALL] Development tooling — ESLint, Prettier, TypeScript
     → Input    : Project root
     → Output   : Linting and formatting toolchain available
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
     → Fail Mode: ESLint config conflicts — run `npx eslint --print-config src/App.tsx`
                  to diagnose rule collisions.

4.7. [INSTALL] Testing dependencies
     → Input    : Project root
     → Output   : Jest, Testing Library, Detox (E2E) installed
     → Tool/Cmd : `pnpm add -D jest jest-expo @testing-library/react-native @testing-library/jest-native`
                  `pnpm add -D detox detox-cli`
                  Add to package.json:
                  ```json
                  "jest": {
                    "preset": "jest-expo",
                    "setupFilesAfterFramework": ["@testing-library/jest-native/extend-expect"]
                  }
                  ```
     → Fail Mode: Detox requires separate native setup in Phase 12 — install now,
                  configure later.

4.8. [AUDIT] Run dependency audit and resolve critical vulnerabilities
     → Input    : Installed node_modules
     → Output   : Zero critical vulnerabilities, documented exceptions for moderate
     → Tool/Cmd : `pnpm audit`
                  `pnpm audit --fix` for auto-fixable issues
     → Fail Mode: Unfixable critical vuln in transitive dep — document in SECURITY.md
                  with planned resolution timeline.

4.9. [LOCK] Commit lockfile
     → Input    : All dependencies installed
     → Output   : pnpm-lock.yaml committed
     → Tool/Cmd : `git add package.json pnpm-lock.yaml && git commit -m "chore: pin all dependencies"`
     → Fail Mode: Lockfile not generated — ensure pnpm (not npm or yarn) is used
                  consistently by all contributors; add `.npmrc`: `engine-strict=true`.
```

**Postcondition:** All production and dev dependencies installed, audited, and locked. No unresolved peer conflicts.

**Feedback Gate:** BACK → PHASE 4 if any later phase reveals a missing or incompatible dependency.

---

## PHASE 5: Configuration & Environment Variables

**Goal:** Establish a secure, environment-aware configuration system that keeps secrets out of version control and provides typed access to all config values.

**Precondition:** Phase 4 complete. `.env` support available via Expo (SDK 49+).

---

```
5.1. [CREATE] Create .env files for each environment
     → Input    : Supabase project credentials from https://app.supabase.com → Settings → API
     → Output   : .env.local, .env.development, .env.production files
     → Tool/Cmd : Create `.env.local` (gitignored, local overrides):
                  ```
                  EXPO_PUBLIC_SUPABASE_URL={{SUPABASE_URL}}
                  EXPO_PUBLIC_SUPABASE_ANON_KEY={{SUPABASE_ANON_KEY}}
                  EXPO_PUBLIC_API_ENV=development
                  ```
                  Note: `EXPO_PUBLIC_` prefix is REQUIRED for Expo to expose vars to JS bundle.
                  Do NOT prefix secrets that must remain server-side only.
     → Fail Mode: Missing EXPO_PUBLIC_ prefix — var will be undefined at runtime with no error.

5.2. [GITIGNORE] Ensure secret files are excluded from version control
     → Input    : .gitignore at project root
     → Output   : .env.local and all *.env files with secrets excluded
     → Tool/Cmd : Add to .gitignore:
                  ```
                  .env.local
                  .env.*.local
                  *.env
                  ```
                  Verify: `git check-ignore -v .env.local`
     → Fail Mode: File already tracked — `git rm --cached .env.local` to untrack.

5.3. [CREATE] Create typed config accessor module
     → Input    : Environment variable keys
     → Output   : `src/constants/config.ts` with typed, validated access
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
     → Fail Mode: `process.env` not available — Expo SDK 49+ supports this natively;
                  older SDKs require `expo-constants` with `app.config.js` extra block.

5.4. [CONFIGURE] Set EAS environment secrets for CI builds
     → Input    : Supabase credentials, EAS authenticated session
     → Output   : Secrets stored in EAS, not in repo
     → Tool/Cmd : `eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value {{SUPABASE_URL}}`
                  `eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value {{SUPABASE_ANON_KEY}}`
                  `eas secret:list`
     → Fail Mode: Secret not injected into build — verify secret names exactly match
                  env var names referenced in code.

5.5. [COMMIT] Commit config module and example env file
     → Input    : src/constants/config.ts, .env.example (non-secret template)
     → Output   : Git commit
     → Tool/Cmd : Create `.env.example` with placeholder values (no real secrets).
                  `git add src/constants/config.ts .env.example .gitignore`
                  `git commit -m "chore: environment variable configuration"`
     → Fail Mode: Accidentally committed real secrets — immediately rotate Supabase
                  anon key in Supabase dashboard; force-push is insufficient (secret is
                  in git history — assume compromised).
```

**Postcondition:** Environment variables are typed, validated at startup, gitignored, and stored securely in EAS for CI builds.

**Feedback Gate:** BACK → PHASE 5 if Phase 10 (API Integration) reveals additional required env vars not captured here.

---

## PHASE 6: Navigation Architecture

**Goal:** Implement complete navigation structure using Expo Router (file-based routing), covering authenticated and unauthenticated route groups, tab navigation, and deep linking.

**Precondition:** Phase 5 complete. `expo-router` and its peer deps installed (Phase 4.2).

---

```
6.1. [CONFIGURE] Set Expo Router as the entry point in package.json
     → Input    : package.json
     → Output   : "main" field points to expo-router entry
     → Tool/Cmd : In package.json, set:
                  `"main": "expo-router/entry"`
                  In app.json, set:
                  `"scheme": "{{APP_SCHEME}}"`
                  `"web": { "bundler": "metro" }`
     → Fail Mode: Old "main": "node_modules/expo/AppEntry.js" entry conflicts —
                  remove it. Only one entry point allowed.

6.2. [CREATE] Establish file-based route structure
     → Input    : src/app/ directory (created Phase 3.1)
     → Output   : Route files matching desired navigation graph
     → Tool/Cmd : Create the following files:
                  `src/app/_layout.tsx`          — Root layout (providers wrap here)
                  `src/app/index.tsx`             — Entry redirect (to tabs or auth)
                  `src/app/(auth)/_layout.tsx`    — Auth group layout
                  `src/app/(auth)/login.tsx`      — Login screen
                  `src/app/(auth)/register.tsx`   — Registration screen
                  `src/app/(tabs)/_layout.tsx`    — Tab navigator layout
                  `src/app/(tabs)/index.tsx`      — Home tab
                  `src/app/(tabs)/profile.tsx`    — Profile tab
                  `src/app/+not-found.tsx`        — 404 fallback
     → Fail Mode: File names with uppercase break Expo Router on case-sensitive Linux
                  filesystems — use only lowercase-hyphenated file names.

6.3. [IMPLEMENT] Root layout — wrap all providers
     → Input    : src/app/_layout.tsx
     → Output   : QueryClientProvider + Zustand store + SafeAreaProvider mounted at root
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
     → Fail Mode: queryClient not yet created — create `src/lib/queryClient.ts`
                  (done in Phase 7) before running; OK to stub with placeholder import.

6.4. [IMPLEMENT] Auth-gated redirect logic in root index
     → Input    : Supabase session state
     → Output   : User routed to (auth) or (tabs) based on JWT session
     → Tool/Cmd : Edit `src/app/index.tsx`:
                  ```tsx
                  import { Redirect } from 'expo-router';
                  import { useSession } from '@/hooks/useSession';

                  export default function Index() {
                    const { session, loading } = useSession();
                    if (loading) return null;
                    return <Redirect href={session ? '/(tabs)' : '/(auth)/login'} />;
                  }
                  ```
                  Note: useSession hook is implemented in Phase 9.
     → Fail Mode: Redirect loop if session state is indeterminate — ensure loading
                  state returns null (splash screen), not a redirect.

6.5. [IMPLEMENT] Tab navigator layout
     → Input    : src/app/(tabs)/_layout.tsx
     → Output   : Bottom tab bar with Home and Profile tabs
     → Tool/Cmd : Edit `src/app/(tabs)/_layout.tsx`:
                  ```tsx
                  import { Tabs } from 'expo-router';

                  export default function TabLayout() {
                    return (
                      <Tabs>
                        <Tabs.Screen name="index" options={{ title: 'Home' }} />
                        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
                      </Tabs>
                    );
                  }
                  ```
     → Fail Mode: Screen name must exactly match file name without extension —
                  `name="index"` matches `index.tsx`.

6.6. [VERIFY] Confirm navigation tree renders on device
     → Input    : Connected Android device (adb), Expo Go on iOS device
     → Output   : All route groups render without errors; tab bar visible
     → Tool/Cmd : `npx expo start --clear`
                  Navigate manually through all defined routes.
     → Fail Mode: "Unmatched route" error — check file names and directory structure
                  against Expo Router docs; ensure `_layout.tsx` exists in each group.

6.7. [COMMIT] Commit navigation structure
     → Input    : All navigation files
     → Output   : Git commit
     → Tool/Cmd : `git add src/app/ && git commit -m "feat: navigation architecture with Expo Router"`
     → Fail Mode: Untracked files — `git status` to verify all files staged.
```

**Postcondition:** Full navigation tree is operational with auth-gated routing. All route groups render. Tab navigation functional on physical device.

**Feedback Gate:** BACK → PHASE 3 if directory structure conflicts with Expo Router's file-system conventions requiring reorganization.

---

## PHASE 7: State Management Setup

**Goal:** Configure TanStack Query for server state (Supabase data fetching/mutations) and Zustand for client/UI state, with proper TypeScript typing and devtools.

**Precondition:** Phase 6 complete. `@tanstack/react-query` and `zustand` installed.

---

```
7.1. [CREATE] Initialize QueryClient with production-appropriate defaults
     → Input    : @tanstack/react-query installed
     → Output   : src/lib/queryClient.ts
     → Tool/Cmd : Create `src/lib/queryClient.ts`:
                  ```ts
                  import { QueryClient } from '@tanstack/react-query';

                  export const queryClient = new QueryClient({
                    defaultOptions: {
                      queries: {
                        staleTime: 1000 * 60 * 5,    // 5 minutes
                        gcTime: 1000 * 60 * 10,       // 10 minutes (formerly cacheTime)
                        retry: 2,
                        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
                        refetchOnWindowFocus: false,   // mobile: irrelevant, avoid noise
                      },
                      mutations: {
                        retry: 0,
                      },
                    },
                  });
                  ```
     → Fail Mode: Importing QueryClient before root layout renders — ensure this file
                  is a module singleton (no React hooks inside); import is safe anywhere.

7.2. [CREATE] Define Zustand store structure — auth slice
     → Input    : Auth state requirements
     → Output   : src/store/authStore.ts
     → Tool/Cmd : Create `src/store/authStore.ts`:
                  ```ts
                  import { create } from 'zustand';
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
     → Fail Mode: Zustand store used before hydration — auth state starts as null/loading;
                  all consumers must handle loading state (enforced by Phase 6.4 pattern).

7.3. [CREATE] Define Zustand store structure — UI slice (example: toast/snackbar)
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
     → Fail Mode: No hard failure; add additional slices as required by feature scope.

7.4. [CONFIGURE] Add TanStack Query DevTools (development only)
     → Input    : @tanstack/react-query installed
     → Output   : DevTools available in dev builds
     → Tool/Cmd : `pnpm add -D @tanstack/react-query-devtools`
                  Note: React Native has no browser devtools panel; use
                  `@tanstack/query-sync-storage-persister` + Flipper plugin as alternative,
                  OR rely on console logging via `queryClient.getQueryCache()`.
                  For mobile: install Reactotron as a debugging alternative.
                  `pnpm add -D reactotron-react-native reactotron-redux`
     → Fail Mode: Reactotron not connecting — ensure device and dev machine on same
                  network; check firewall on Linux: `sudo ufw allow 9090`.

7.5. [VERIFY] Confirm QueryClient is mounted and stores initialize cleanly
     → Input    : Root layout updated in Phase 6.3
     → Output   : No runtime errors; auth store initializes to isLoading: true
     → Tool/Cmd : `npx expo start --clear`
                  Add temporary log: `console.log(useAuthStore.getState())` in index.tsx
     → Fail Mode: "No QueryClient set" error — QueryClientProvider is missing from
                  component tree; verify _layout.tsx wraps Stack with provider.

7.6. [COMMIT] Commit state management setup
     → Input    : src/lib/queryClient.ts, src/store/*.ts
     → Output   : Git commit
     → Tool/Cmd : `git add src/lib/ src/store/ && git commit -m "feat: TanStack Query + Zustand state management setup"`
     → Fail Mode: None beyond standard git issues.
```

**Postcondition:** QueryClient singleton configured with correct defaults. Auth and UI Zustand stores initialized. State management layer is ready to be consumed by hooks and screens.

**Feedback Gate:** BACK → PHASE 7 if Phase 10 (API Integration) reveals that query defaults (staleTime, retry) are inappropriate for Supabase's response characteristics.

---

## PHASE 8: Component & Screen Development

**Goal:** Build the component library and screen compositions, following strict separation between dumb/presentational components and smart/connected screens.

**Precondition:** Phase 7 complete. Navigation and state management are operational.

---

```
8.1. [DESIGN] Define component taxonomy
     → Input    : Feature requirements
     → Output   : Documented component categories in ARCHITECTURE.md
     → Tool/Cmd : Update ARCHITECTURE.md to define:
                  Primitives  — Text, Button, Input, Icon (no business logic)
                  Composites  — Form, Card, ListItem (composed from Primitives)
                  Screens     — Full-page layouts; connected to hooks/stores
                  Layouts     — SafeAreaView wrappers, KeyboardAwareView, etc.
     → Fail Mode: No hard failure — lack of taxonomy causes inconsistency at scale.

8.2. [CREATE] Button primitive component with accessibility support
     → Input    : Design system tokens (colors, spacing)
     → Output   : src/components/Button.tsx
     → Tool/Cmd : Create `src/components/Button.tsx` with:
                  - Variants: primary | secondary | destructive
                  - Props: onPress, label, disabled, loading, accessibilityLabel
                  - Uses StyleSheet.create for performance
                  - Includes ActivityIndicator for loading state
                  - `accessible={true}` and `accessibilityRole="button"` required
     → Fail Mode: Missing accessibilityLabel prop — flagged in Phase 14 accessibility audit;
                  enforce via TypeScript required prop.

8.3. [CREATE] TextInput primitive with validation state
     → Input    : Form requirements
     → Output   : src/components/TextInput.tsx
     → Tool/Cmd : Create `src/components/TextInput.tsx` with:
                  - Props: value, onChangeText, error, label, secureTextEntry, keyboardType
                  - Displays error string below input when `error` prop is set
                  - `autoCorrect={false}` for credential fields
                  - `accessibilityLabel` required prop
     → Fail Mode: Missing error display causes silent validation failures in forms.

8.4. [CREATE] Login screen
     → Input    : Navigation (auth)/login route exists (Phase 6.2)
     → Output   : src/app/(auth)/login.tsx — complete login UI
     → Tool/Cmd : Implement login screen with:
                  - Email TextInput (keyboardType="email-address", autoCapitalize="none")
                  - Password TextInput (secureTextEntry={true})
                  - Submit Button (connected to mutation in Phase 9)
                  - Link to register route: `<Link href="/(auth)/register">`
                  - Loading and error states driven by Zustand authStore
     → Fail Mode: Keyboard covers input fields — wrap in KeyboardAvoidingView
                  with `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`.

8.5. [CREATE] Home tab screen (stub — fleshed out with real data in Phase 10)
     → Input    : (tabs)/index.tsx route exists
     → Output   : Stub screen with placeholder data
     → Tool/Cmd : Implement minimal screen with heading and placeholder list.
                  Will be replaced with real query data in Phase 10.
     → Fail Mode: None — stub is intentionally minimal.

8.6. [CREATE] Profile screen
     → Input    : (tabs)/profile.tsx route exists, auth session available
     → Output   : Profile screen showing user email and logout button
     → Tool/Cmd : Implement with:
                  - Display `session.user.email` from authStore
                  - Logout Button → calls signOut from Phase 9
     → Fail Mode: Null session access — always guard with `session?.user?.email ?? ''`.

8.7. [VERIFY] All screens render without errors on device
     → Input    : Connected device
     → Output   : All screens navigable, no red error screens
     → Tool/Cmd : `npx expo start --clear`
                  Navigate through every defined route manually.
     → Fail Mode: "Text strings must be rendered within a <Text> component" —
                  locate stray string literals outside JSX Text tags.

8.8. [COMMIT] Commit component and screen foundation
     → Input    : All component and screen files
     → Output   : Git commit
     → Tool/Cmd : `git add src/components/ src/app/ && git commit -m "feat: core components and screen scaffolds"`
     → Fail Mode: None beyond standard git issues.
```

**Postcondition:** Core component primitives exist. All navigation routes render complete (if stub) screens. No runtime errors on device.

**Feedback Gate:** BACK → PHASE 8 if Phase 12 (Testing) reveals accessibility failures or rendering bugs requiring structural component changes.

---

## PHASE 9: Business Logic & Service Layer

**Goal:** Implement all business logic, authentication flows, and service abstractions isolated from UI components.

**Precondition:** Phase 8 complete. Supabase client not yet initialized (done here).

---

```
9.1. [CREATE] Initialize Supabase client singleton
     → Input    : Config.supabaseUrl, Config.supabaseAnonKey from Phase 5.3
     → Output   : src/services/supabase.ts — Supabase client singleton
     → Tool/Cmd : Create `src/services/supabase.ts`:
                  ```ts
                  import 'react-native-url-polyfill/auto';
                  import { createClient } from '@supabase/supabase-js';
                  import AsyncStorage from '@react-native-async-storage/async-storage';
                  import { Config } from '@/constants/config';

                  export const supabase = createClient(Config.supabaseUrl, Config.supabaseAnonKey, {
                    auth: {
                      storage: AsyncStorage,
                      autoRefreshToken: true,
                      persistSession: true,
                      detectSessionInUrl: false,
                    },
                  });
                  ```
                  Critical: `detectSessionInUrl: false` is REQUIRED for React Native.
                  `react-native-url-polyfill/auto` must be imported FIRST.
     → Fail Mode: URL parsing error on startup — missing url polyfill import at top of file.
                  Session not persisted between app restarts — missing AsyncStorage config.

9.2. [CREATE] Auth service — login, register, logout, session listener
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

                    onAuthStateChange: (callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) =>
                      supabase.auth.onAuthStateChange(callback),
                  };
                  ```
     → Fail Mode: JWT refresh fails after token expiry — Supabase client handles this
                  automatically if autoRefreshToken: true; verify in supabase.ts config.

9.3. [CREATE] useSession hook — bootstrap auth state into Zustand
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
                      authService.getSession().then(({ data: { session } }) => {
                        setSession(session);
                        setLoading(false);
                      });

                      const { data: { subscription } } = authService.onAuthStateChange(
                        (_event, session) => setSession(session)
                      );

                      return () => subscription.unsubscribe();
                    }, []);

                    return { session, loading: isLoading };
                  }
                  ```
     → Fail Mode: Memory leak if component unmounts before getSession resolves —
                  add isMounted flag guard or use AbortController if applicable.

9.4. [CREATE] useSignIn mutation hook (TanStack Query mutation)
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
                        if (error) throw error;
                        router.replace('/(tabs)');
                      },
                      onError: (error) => {
                        // Error surface handled by calling component via mutation.error
                      },
                    });
                  }
                  ```
     → Fail Mode: Supabase returns error in `data.error`, not thrown — must check
                  `data.error` and throw manually if present (as shown above).

9.5. [CREATE] Generic data service abstraction for Supabase tables
     → Input    : Supabase database schema (from Supabase dashboard → Table Editor)
     → Output   : src/services/dataService.ts
     → Tool/Cmd : Create `src/services/dataService.ts` with typed query builder:
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
     → Fail Mode: RLS (Row Level Security) policies blocking queries — configure RLS
                  policies in Supabase dashboard for each table; 403 errors indicate
                  missing or incorrect RLS rules.

9.6. [COMMIT] Commit service layer
     → Input    : src/services/, src/hooks/useSession.ts, src/hooks/useSignIn.ts
     → Output   : Git commit
     → Tool/Cmd : `git add src/services/ src/hooks/ && git commit -m "feat: Supabase service layer and auth hooks"`
     → Fail Mode: None beyond standard git issues.
```

**Postcondition:** Supabase client initialized. Auth flows (sign in, sign up, sign out, session restore) are implemented and abstracted behind service + hook layers. Business logic is decoupled from UI.

**Feedback Gate:** BACK → PHASE 5 if Supabase credentials are incorrect or missing — do not hardcode credentials as a fix.

---

## PHASE 10: API Integration

**Goal:** Connect all screens to live Supabase data via TanStack Query hooks, implementing complete CRUD flows with optimistic updates and error handling.

**Precondition:** Phase 9 complete. Supabase project has at least one table configured with RLS enabled.

---

```
10.1. [GENERATE] Generate TypeScript types from Supabase schema
      → Input    : Supabase project with tables created
      → Output   : src/types/database.types.ts — auto-generated schema types
      → Tool/Cmd : `npx supabase login`
                   `npx supabase gen types typescript --project-id {{SUPABASE_PROJECT_ID}} > src/types/database.types.ts`
      → Fail Mode: supabase CLI not installed — `pnpm add -D supabase`.
                   Project ID not found — check Supabase dashboard URL:
                   https://app.supabase.com/project/{{SUPABASE_PROJECT_ID}}.

10.2. [CREATE] TanStack Query hook for listing a resource
      → Input    : dataService.list, generated types
      → Output   : Example: src/hooks/useItems.ts
      → Tool/Cmd : Create `src/hooks/useItems.ts` (replace "Items" with your resource):
                   ```ts
                   import { useQuery } from '@tanstack/react-query';
                   import { dataService } from '@/services/dataService';
                   import { Database } from '@/types/database.types';

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
                     });
                   }
                   ```
      → Fail Mode: Stale data after mutation — invalidate query keys in mutation
                   onSuccess (see 10.3).

10.3. [CREATE] TanStack Query mutation hook with optimistic update
      → Input    : dataService.create, queryClient
      → Output   : Example: src/hooks/useCreateItem.ts
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
                         queryClient.invalidateQueries({ queryKey: itemKeys.all });
                       },
                       onError: (error) => {
                         console.error('Create failed:', error);
                       },
                     });
                   }
                   ```
      → Fail Mode: Race condition between invalidation and refetch — TanStack Query
                   handles this correctly; do not add manual delays.

10.4. [INTEGRATE] Wire Home screen to real data from useItems hook
      → Input    : src/app/(tabs)/index.tsx (stub from Phase 8.5)
      → Output   : Screen displays live Supabase data
      → Tool/Cmd : Update `src/app/(tabs)/index.tsx`:
                   - Call `useItems()` hook
                   - Render loading spinner when `isLoading === true`
                   - Render error message when `isError === true`
                   - Render FlatList with `data` when successful
      → Fail Mode: Empty data array (not error) — check RLS policies; authenticated
                   user may have no rows matching RLS rules. Test in Supabase SQL editor.

10.5. [TEST] Manually verify CRUD flows on physical device
      → Input    : Connected Android device, Supabase table with test data
      → Output   : Create, read, update, delete all work end-to-end
      → Tool/Cmd : `npx expo start --clear`
                   Manually exercise all CRUD operations in the app.
                   Check Supabase dashboard → Table Editor to confirm DB changes.
      → Fail Mode: CORS error — irrelevant for native apps; if seen, indicates a web
                   preview is being used. Switch to native device target.

10.6. [COMMIT] Commit API integration layer
      → Input    : src/hooks/use*.ts, src/types/database.types.ts, updated screens
      → Output   : Git commit
      → Tool/Cmd : `git add src/hooks/ src/types/ src/app/ && git commit -m "feat: Supabase API integration with TanStack Query"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** App reads and writes real data from Supabase. All screens connected to live data. Query cache and invalidation working correctly.

**Feedback Gate:** BACK → PHASE 9 if RLS policies or service layer abstractions are insufficient for query complexity encountered here.

---

## PHASE 11: Local Storage & Persistence

**Goal:** Implement all client-side persistence requirements — auth session persistence (already covered by Supabase + AsyncStorage), user preferences, and offline caching.

**Precondition:** Phase 10 complete. `@react-native-async-storage/async-storage` already installed.

---

```
11.1. [VERIFY] Confirm Supabase auth session persists across app restarts
      → Input    : Working auth flow from Phase 9
      → Output   : User remains logged in after force-closing and reopening app
      → Tool/Cmd : Sign in → Force close app → Reopen → Confirm redirect to (tabs)
                   not (auth)/login.
      → Fail Mode: Session not restored — verify AsyncStorage is set in supabase.ts
                   auth config (Phase 9.1). Check: `AsyncStorage.getItem('supabase.auth.token')`.

11.2. [CREATE] User preferences store with AsyncStorage persistence
      → Input    : Zustand, AsyncStorage
      → Output   : src/store/preferencesStore.ts — persisted Zustand slice
      → Tool/Cmd : `pnpm add zustand` (already installed)
                   Install persist middleware (built into Zustand):
                   Create `src/store/preferencesStore.ts`:
                   ```ts
                   import { create } from 'zustand';
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
      → Fail Mode: Persist hydration not awaited — Zustand's persist middleware is async;
                   use `usePreferencesStore.persist.hasHydrated()` to gate renders if needed.

11.3. [CREATE] Offline-aware query configuration (TanStack Query persistence)
      → Input    : queryClient from Phase 7.1
      → Output   : Query cache persisted to AsyncStorage for offline reads
      → Tool/Cmd : `pnpm add @tanstack/query-async-storage-persister @tanstack/react-query-persist-client`
                   Update `src/lib/queryClient.ts` or create `src/lib/persister.ts`:
                   ```ts
                   import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
                   import AsyncStorage from '@react-native-async-storage/async-storage';

                   export const asyncStoragePersister = createAsyncStoragePersister({
                     storage: AsyncStorage,
                   });
                   ```
                   Wrap QueryClientProvider in _layout.tsx with PersistQueryClientProvider.
      → Fail Mode: Stale offline cache served when online — configure `maxAge` on persister;
                   set to 1000 * 60 * 60 * 24 (24 hours) as a baseline.

11.4. [VERIFY] Confirm persistence across restarts for preferences and query cache
      → Input    : Physical device
      → Output   : Theme preference and cached data survive app restart
      → Tool/Cmd : Set a preference → Kill app → Reopen → Verify preference retained.
                   Disable network on device → Open app → Verify cached data shown.
      → Fail Mode: Cache not loading offline — check persister is correctly wired into
                   PersistQueryClientProvider.

11.5. [COMMIT] Commit persistence layer
      → Input    : src/store/preferencesStore.ts, src/lib/persister.ts, updated layout
      → Output   : Git commit
      → Tool/Cmd : `git add src/store/ src/lib/ src/app/_layout.tsx && git commit -m "feat: local persistence with Zustand middleware and TanStack Query cache"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** Auth session persists across restarts. User preferences are persisted to AsyncStorage via Zustand middleware. Query cache supports offline reads.

**Feedback Gate:** BACK → PHASE 7 if QueryClient configuration requires modification to support persistence correctly.

---

## PHASE 12: Testing

**Goal:** Establish and execute a complete three-tier test suite: unit tests for logic/hooks, integration tests for screens, and E2E tests for critical user journeys.

**Precondition:** Phase 11 complete. Jest, Testing Library, and Detox installed (Phase 4.7).

---

```
12.1. [CONFIGURE] Finalize Jest configuration for Expo
      → Input    : package.json jest config from Phase 4.7
      → Output   : Jest runs without configuration errors
      → Tool/Cmd : Verify `package.json` jest section:
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
                   Run: `pnpm test -- --passWithNoTests`
      → Fail Mode: Transform error for expo/react-native module — transformIgnorePatterns
                   must whitelist all Expo packages; extend the pattern for missing modules.

12.2. [WRITE] Unit tests — pure utility functions
      → Input    : src/utils/ functions
      → Output   : src/utils/__tests__/*.test.ts
      → Tool/Cmd : For each utility function, write tests covering:
                   - Happy path with valid inputs
                   - Edge cases (null, empty string, boundary values)
                   - Error cases
                   Run: `pnpm test src/utils`
      → Fail Mode: Test imports fail for utils with side effects — mock side effects
                   with `jest.mock()`.

12.3. [WRITE] Unit tests — Zustand stores
      → Input    : src/store/*.ts
      → Output   : src/store/__tests__/*.test.ts
      → Tool/Cmd : For each store:
                   ```ts
                   import { useAuthStore } from '@/store/authStore';
                   beforeEach(() => useAuthStore.setState({ session: null, isLoading: true }));
                   test('setSession updates session', () => {
                     useAuthStore.getState().setSession({ user: { email: 'test@test.com' } } as any);
                     expect(useAuthStore.getState().session?.user.email).toBe('test@test.com');
                   });
                   ```
      → Fail Mode: AsyncStorage not mocked — add jest mock:
                   `jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));`

12.4. [WRITE] Integration tests — screens with React Testing Library
      → Input    : Screen components, mocked services
      → Output   : src/app/__tests__/*.test.tsx
      → Tool/Cmd : For Login screen:
                   ```ts
                   import { render, fireEvent, waitFor } from '@testing-library/react-native';
                   import LoginScreen from '@/app/(auth)/login';
                   jest.mock('@/hooks/useSignIn');
                   test('shows error on failed login', async () => {
                     const { getByTestId, getByText } = render(<LoginScreen />);
                     fireEvent.changeText(getByTestId('email-input'), 'bad@email.com');
                     fireEvent.changeText(getByTestId('password-input'), 'wrong');
                     fireEvent.press(getByTestId('login-button'));
                     await waitFor(() => expect(getByText(/invalid credentials/i)).toBeTruthy());
                   });
                   ```
                   Requires `testID` props added to components in Phase 8.
      → Fail Mode: Missing testID props on components — add `testID` to all interactive
                   elements; this is BACK → PHASE 8.

12.5. [CONFIGURE] Detox for E2E testing
      → Input    : Detox installed (Phase 4.7)
      → Output   : .detoxrc.js configured for Android (primary — Linux cannot run iOS E2E)
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
                   Note: Detox on Expo Managed requires a custom dev client build.
                   Run: `eas build --profile development --platform android` (Phase 16 prerequisite)
                   For now: create e2e/ directory and stub test files.
      → Fail Mode: Expo Managed + Detox requires dev client — cannot run Detox against
                   Expo Go. EAS dev build is mandatory; defer full E2E to Phase 16/17.

12.6. [WRITE] E2E test — critical path: login flow
      → Input    : e2e/ directory, Detox configured
      → Output   : e2e/login.test.js
      → Tool/Cmd : Create `e2e/login.test.js`:
                   ```js
                   describe('Login flow', () => {
                     beforeAll(async () => { await device.launchApp(); });
                     it('should log in with valid credentials', async () => {
                       await element(by.id('email-input')).typeText('{{TEST_USER_EMAIL}}');
                       await element(by.id('password-input')).typeText('{{TEST_USER_PASSWORD}}');
                       await element(by.id('login-button')).tap();
                       await expect(element(by.id('home-screen'))).toBeVisible();
                     });
                   });
                   ```
      → Fail Mode: Test user not seeded in Supabase — create test user in Supabase Auth
                   dashboard or via seed script before running E2E.

12.7. [RUN] Execute full test suite and enforce coverage threshold
      → Input    : All tests written
      → Output   : Coverage report; zero failing tests
      → Tool/Cmd : `pnpm test -- --coverage --coverageThreshold='{"global":{"lines":70}}'`
                   Review coverage report at `coverage/lcov-report/index.html`
      → Fail Mode: Coverage below threshold — write additional tests for uncovered paths.
                   Do NOT lower threshold as a fix.

12.8. [COMMIT] Commit test suite
      → Input    : All test files and Detox config
      → Output   : Git commit
      → Tool/Cmd : `git add src/**/__tests__/ e2e/ .detoxrc.js && git commit -m "test: unit, integration, and E2E test suite"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** Unit tests cover utilities and stores. Integration tests cover critical screens. E2E test stubs are ready for execution after dev client build. Coverage ≥70% on lines.

**Feedback Gate:** BACK → PHASE 8 if missing `testID` props require component modifications.

---

## PHASE 13: Performance Optimization

**Goal:** Identify and resolve performance bottlenecks in rendering, bundle size, and network, achieving smooth 60fps interactions and sub-3s cold start.

**Precondition:** Phase 12 complete. App is functionally complete (or near-complete).

---

```
13.1. [AUDIT] Enable React Native performance monitor
      → Input    : Physical Android device
      → Output   : FPS and JS thread load visible
      → Tool/Cmd : In dev build, shake device → "Perf Monitor"
                   Or in code: `import { PerformanceObserver } from 'react-native'`
                   Target: UI thread ≥60fps, JS thread ≥45fps sustained.
      → Fail Mode: FPS drops below 45 consistently — profile with Flipper or
                   Android Studio Profiler.

13.2. [OPTIMIZE] Memoize expensive list renders
      → Input    : FlatList components in screens
      → Output   : Reduced re-renders on list data updates
      → Tool/Cmd : Add `React.memo` to list item components.
                   Add `useCallback` to `renderItem` functions.
                   Add `keyExtractor` returning stable string IDs.
                   Set `getItemLayout` on FlatList if items have fixed height (removes
                   dynamic measurement overhead).
      → Fail Mode: Over-memoization (wrapping simple components) adds overhead —
                   only memoize components proven expensive via profiler.

13.3. [OPTIMIZE] Lazy-load heavy screens with React.lazy + Suspense
      → Input    : Screen components with heavy dependencies
      → Output   : Reduced initial JS bundle evaluation time
      → Tool/Cmd : For screens not in the critical path (e.g., Settings):
                   ```ts
                   const SettingsScreen = React.lazy(() => import('@/screens/SettingsScreen'));
                   ```
                   Wrap with `<Suspense fallback={<LoadingSpinner />}>`.
      → Fail Mode: Expo Router does not fully support React.lazy for route components —
                   use dynamic imports at the hook/service level instead.

13.4. [OPTIMIZE] Image optimization
      → Input    : Images in src/assets/
      → Output   : Compressed, correctly sized image assets
      → Tool/Cmd : Use `expo-image` instead of React Native's Image component:
                   `npx expo install expo-image`
                   expo-image provides disk+memory caching, progressive loading,
                   and blurhash placeholders natively.
                   Compress source images to WebP: `cwebp input.png -o output.webp`
                   (install: `sudo apt install -y webp`)
      → Fail Mode: expo-image not rendering on old Android — requires API 21+;
                   verify minSdkVersion in app.json android config.

13.5. [OPTIMIZE] TanStack Query — tune staleTime for each query by data volatility
      → Input    : All useQuery hooks
      → Output   : Reduced unnecessary network requests
      → Tool/Cmd : Categorize data by update frequency:
                   - Static (user profile): staleTime: Infinity
                   - Semi-static (app config): staleTime: 1000 * 60 * 30
                   - Dynamic (feed data): staleTime: 1000 * 60 * 2
                   Override per-query: `useQuery({ ..., staleTime: Infinity })`
      → Fail Mode: Infinity staleTime prevents updates — add explicit invalidation
                   on relevant mutations.

13.6. [OPTIMIZE] Bundle analysis — identify large dependencies
      → Input    : Built bundle
      → Output   : Bundle composition report
      → Tool/Cmd : `npx expo export --platform android`
                   `npx source-map-explorer dist/_expo/static/js/android/*.js`
                   (install: `pnpm add -D source-map-explorer`)
      → Fail Mode: source-map-explorer unavailable — use `npx expo export --dump-sourcemap`
                   and analyze manually.

13.7. [COMMIT] Commit performance optimizations
      → Input    : All optimization changes
      → Output   : Git commit
      → Tool/Cmd : `git add . && git commit -m "perf: memoization, image optimization, query tuning"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** App sustains 60fps on mid-range Android device. Image assets optimized. Bundle size analyzed. Query stale times tuned to data volatility.

**Feedback Gate:** BACK → PHASE 4 if bundle analysis reveals a large dependency that should be replaced or eliminated.

---

## PHASE 14: Accessibility & Internationalization

**Goal:** Ensure the app meets WCAG 2.1 AA accessibility standards and is architected for multi-language support via i18next.

**Precondition:** Phase 13 complete. All screens rendering final content.

---

```
14.1. [AUDIT] Run accessibility audit — check all interactive elements
      → Input    : All screens on physical device
      → Output   : List of accessibility gaps
      → Tool/Cmd : Enable TalkBack on Android: Settings → Accessibility → TalkBack
                   Navigate entire app with TalkBack active.
                   Verify: Every button has a spoken label.
                   Every input has a spoken label and role.
                   Error messages are announced.
                   Focus order is logical.
      → Fail Mode: Unlabeled elements — add `accessibilityLabel` and `accessibilityRole`
                   to all interactive components; BACK → PHASE 8 for structural fixes.

14.2. [IMPLEMENT] Ensure color contrast ratios meet AA standard
      → Input    : App color palette (from src/constants/ or design system)
      → Output   : All text/background combinations ≥4.5:1 contrast ratio
      → Tool/Cmd : Use https://webaim.org/resources/contrastchecker/ to audit colors.
                   Update color constants if contrast fails.
      → Fail Mode: Brand color fails contrast — add high-contrast text variants for
                   accessibility mode; do NOT compromise brand color.

14.3. [INSTALL] Install i18next for internationalization
      → Input    : Project root
      → Output   : i18next and react-i18next installed
      → Tool/Cmd : `pnpm add i18next react-i18next`
                   `npx expo install expo-localization`
      → Fail Mode: expo-localization version conflict — use `npx expo install` (not pnpm)
                   for all Expo-namespaced packages to get SDK-compatible version.

14.4. [CONFIGURE] Set up i18next with device locale detection
      → Input    : expo-localization, i18next
      → Output   : src/i18n/index.ts — i18next initialization
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
                   });

                   export default i18n;
                   ```
                   Create `src/i18n/locales/en.json` with all user-visible strings.
                   Import `src/i18n/index.ts` at the top of `src/app/_layout.tsx`.
      → Fail Mode: Strings not updating on language change — ensure `i18n.changeLanguage()`
                   is called and components using `useTranslation()` re-render.

14.5. [REFACTOR] Replace all hardcoded strings in components with i18n keys
      → Input    : All screen and component files
      → Output   : Zero hardcoded user-visible strings
      → Tool/Cmd : In each component: `const { t } = useTranslation();`
                   Replace: `"Log In"` → `{t('auth.login.button')}`
                   Update en.json with all keys.
      → Fail Mode: Missing translation key renders raw key string — configure i18next
                   `missingKeyHandler` to log warnings in development.

14.6. [COMMIT] Commit accessibility and i18n work
      → Input    : All modified files
      → Output   : Git commit
      → Tool/Cmd : `git add . && git commit -m "feat: accessibility improvements and i18n setup"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** App navigable via TalkBack. All interactive elements labeled. Color contrast ≥4.5:1. All user-visible strings externalized to i18n locale files.

**Feedback Gate:** BACK → PHASE 8 if accessibility audit finds structural component issues requiring re-implementation.

---

## PHASE 15: Security Hardening

**Goal:** Harden the application against common mobile security threats including token exposure, insecure storage, and network interception.

**Precondition:** Phase 14 complete. Auth and data layers finalized.

---

```
15.1. [AUDIT] Verify no secrets in source code or committed files
      → Input    : Entire git repository
      → Output   : Zero secrets in code or history
      → Tool/Cmd : `git log --all --full-history -- '**/.env*'` (check for accidentally committed env files)
                   `grep -rn 'SUPABASE_' src/ --include="*.ts" --include="*.tsx"` — should only show Config import, not raw strings.
                   Install trufflehog for deep scan:
                   `pip install trufflehog3 --break-system-packages`
                   `trufflehog3 --no-history .`
      → Fail Mode: Secret found in history — rotate the key immediately in Supabase dashboard.
                   Git history rewrite alone is insufficient for security purposes.

15.2. [IMPLEMENT] Certificate pinning for Supabase API calls
      → Input    : Supabase domain
      → Output   : Network requests fail if certificate doesn't match pin
      → Tool/Cmd : `npx expo install expo-certificate-pinning` (if available for SDK version)
                   OR use `react-native-ssl-pinning`:
                   `pnpm add react-native-ssl-pinning`
                   Note: Expo Managed workflow limits native module availability.
                   If expo-certificate-pinning is unavailable, document as known risk
                   and defer to bare ejection or EAS Modules if required.
      → Fail Mode: Pinning breaks during Supabase certificate rotation — monitor Supabase
                   certificate expiry and update pin before rotation.

15.3. [IMPLEMENT] Secure sensitive data — do not store JWT in plain AsyncStorage beyond session
      → Input    : Supabase auth configuration
      → Output   : JWT stored via Supabase's own secure storage layer
      → Tool/Cmd : Supabase client already uses AsyncStorage for session (Phase 9.1).
                   AsyncStorage is NOT encrypted on Android by default.
                   For high-security apps: install `expo-secure-store` and replace
                   AsyncStorage in Supabase client config:
                   `npx expo install expo-secure-store`
                   Create `src/lib/secureStorage.ts` implementing the AsyncStorage interface
                   backed by expo-secure-store.
      → Fail Mode: expo-secure-store has a per-entry 2048-byte limit — JWT may exceed this.
                   Workaround: store only refresh token in SecureStore; access token in memory only.

15.4. [IMPLEMENT] Obfuscate JavaScript bundle for production builds
      → Input    : eas.json production profile
      → Output   : Minified and obfuscated JS in production builds
      → Tool/Cmd : In eas.json production profile, add:
                   ```json
                   "env": { "EXPO_PUBLIC_API_ENV": "production" }
                   ```
                   Expo/Metro handles minification automatically in production builds.
                   For enhanced obfuscation: `pnpm add -D @obfuscator/metro-plugin`
                   (SPECULATIVE: verify compatibility with current Expo SDK before adopting.)
      → Fail Mode: Obfuscation breaks source maps — maintain unobfuscated source maps
                   in EAS build artifacts for crash debugging (never ship to users).

15.5. [IMPLEMENT] Input validation and sanitization
      → Input    : All user-facing form inputs
      → Output   : Validated, sanitized inputs before any service call
      → Tool/Cmd : `pnpm add zod`
                   Define schemas in `src/utils/validation.ts`:
                   ```ts
                   import { z } from 'zod';
                   export const loginSchema = z.object({
                     email: z.string().email('Invalid email'),
                     password: z.string().min(8, 'Minimum 8 characters'),
                   });
                   ```
                   Apply `loginSchema.parse(formValues)` before calling authService.signIn.
      → Fail Mode: Zod parse throws — catch and map ZodError to field-level errors
                   for display in UI.

15.6. [CONFIGURE] Disable debug mode and logs in production
      → Input    : App codebase
      → Output   : No console.log output in production builds
      → Tool/Cmd : `pnpm add -D babel-plugin-transform-remove-console`
                   In `babel.config.js`, add conditionally:
                   ```js
                   plugins: process.env.NODE_ENV === 'production'
                     ? [['transform-remove-console', { exclude: ['error', 'warn'] }]]
                     : []
                   ```
      → Fail Mode: Plugin not applied in EAS builds — verify `NODE_ENV=production` is set
                   in EAS production build profile.

15.7. [COMMIT] Commit security hardening
      → Input    : All security-related changes
      → Output   : Git commit
      → Tool/Cmd : `git add . && git commit -m "security: input validation, secure storage, console removal"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** No secrets in source. JWT stored via secure mechanism. Inputs validated with Zod. Production builds have console output removed. Certificate pinning documented.

**Feedback Gate:** BACK → PHASE 5 if audit finds secrets improperly managed in environment configuration.

---

## PHASE 16: Build Configuration (iOS & Android via EAS)

**Goal:** Configure EAS Build profiles for development, preview, and production — accounting for the Linux-only constraint requiring all iOS builds to be cloud-compiled.

**Precondition:** Phase 15 complete. EAS authenticated (Phase 1.9). App identifiers configured (Phase 2.3).

---

```
16.1. [CONFIGURE] Define EAS build profiles in eas.json
      → Input    : EAS project linked (Phase 2.4)
      → Output   : eas.json with development, preview, and production profiles
      → Tool/Cmd : Edit `eas.json`:
                   ```json
                   {
                     "cli": { "version": ">= 10.0.0" },
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
                           "appleId": "{{APPLE_ID: your Apple developer account email}}",
                           "ascAppId": "{{ASC_APP_ID: App Store Connect app numeric ID}}"
                         },
                         "android": {
                           "serviceAccountKeyPath": "./google-play-service-account.json",
                           "track": "production"
                         }
                       }
                     }
                   }
                   ```
      → Fail Mode: Missing cli.version constraint causes EAS to use unexpected CLI version.

16.2. [CONFIGURE] iOS code signing — automated managed by EAS
      → Input    : Apple Developer account credentials
      → Output   : Provisioning profiles and certificates managed by EAS
      → Tool/Cmd : `eas credentials --platform ios`
                   Select: "Expo Go (managed)" → let EAS handle all provisioning.
                   EAS will prompt for Apple ID and 2FA code.
                   LINUX NOTE: This runs entirely via EAS cloud — no Mac required.
      → Fail Mode: Apple 2FA not reachable — must have access to the Apple ID's 2FA device
                   during this step; cannot be deferred.

16.3. [CONFIGURE] Android keystore — automated managed by EAS
      → Input    : EAS project
      → Output   : Android signing keystore stored in EAS
      → Tool/Cmd : `eas credentials --platform android`
                   Select: let EAS generate and store keystore.
                   CRITICAL: Download and back up keystore locally IMMEDIATELY:
                   `eas credentials --platform android` → "Download keystore"
                   Store securely — losing it permanently blocks Play Store updates.
      → Fail Mode: Lost keystore = cannot update app on Play Store. No recovery path.
                   Backup is MANDATORY before proceeding.

16.4. [BUILD] Execute development client build (Android — local device)
      → Input    : eas.json development profile, Android device connected
      → Output   : Development APK installed on device; enables Detox E2E
      → Tool/Cmd : `eas build --profile development --platform android`
                   When complete: `eas build:list` → download APK URL
                   Install on device: `adb install path/to/dev.apk`
      → Fail Mode: Build fails in EAS — check build logs:
                   `eas build --profile development --platform android --local` (runs on your Linux machine)
                   Local builds require Android SDK and correct JAVA_HOME (Phase 1.5–1.7).

16.5. [BUILD] Execute development client build (iOS — EAS cloud)
      → Input    : eas.json development profile, Apple credentials configured
      → Output   : IPA built in EAS cloud; installable via TestFlight or direct install
      → Tool/Cmd : `eas build --profile development --platform ios`
                   Monitor: `eas build:list`
                   Install on iOS device via QR code link in EAS dashboard.
                   LINUX NOTE: This build runs entirely on EAS cloud Mac infrastructure.
      → Fail Mode: Provisioning profile not including test device UDID — register device
                   UDID in Apple Developer portal, then re-run `eas credentials`.

16.6. [BUILD] Execute preview build (both platforms)
      → Input    : eas.json preview profile, EAS secrets configured (Phase 5.4)
      → Output   : Distributable APK (Android) and IPA (iOS) for QA
      → Tool/Cmd : `eas build --profile preview --platform all`
      → Fail Mode: EAS secret not injected — verify `eas secret:list` matches
                   env var names in config.ts.

16.7. [VERIFY] Confirm dev client build runs on device and Detox E2E is executable
      → Input    : Dev APK installed (16.4)
      → Output   : App runs from custom dev client; Detox can attach
      → Tool/Cmd : Launch app from device. Confirm it connects to Metro dev server.
                   `pnpm detox test -c android.att` (stub tests from Phase 12.6)
      → Fail Mode: Detox cannot find app — verify binaryPath in .detoxrc.js matches
                   downloaded APK location.

16.8. [COMMIT] Commit build configuration
      → Input    : eas.json (no credentials — those stay in EAS)
      → Output   : Git commit
      → Tool/Cmd : `git add eas.json && git commit -m "chore: EAS build profiles configured"`
                   NEVER commit google-play-service-account.json or any credential file.
      → Fail Mode: Accidentally committed credential file — revoke and rotate immediately.
```

**Postcondition:** EAS build profiles for all three environments configured. iOS code signing managed by EAS. Android keystore backed up. Development builds installed on physical devices for both platforms. Detox E2E is executable.

**Feedback Gate:** BACK → PHASE 2 if bundle identifier or package name requires correction — these cannot be changed post-submission.

---

## PHASE 17: CI/CD Pipeline Setup

**Goal:** Automate build, test, and deployment via GitHub Actions + EAS, with branch-based environment targeting.

**Precondition:** Phase 16 complete. Code in GitHub (or GitLab). EAS secrets configured.

---

```
17.1. [CREATE] GitHub Actions workflow — CI (test on every PR)
      → Input    : .github/workflows/ directory
      → Output   : .github/workflows/ci.yml
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
                         - uses: actions/setup-node@v4
                           with:
                             node-version: '20'
                             cache: 'npm'
                         - run: npm ci
                         - run: npx eslint src/
                         - run: npx tsc --noEmit
                         - run: npx jest --ci --coverage
                   ```
      → Fail Mode: `npm ci` fails if only pnpm-lock.yaml exists — either commit
                   package-lock.json as well, or switch to pnpm in CI:
                   Add `- uses: pnpm/action-setup@v3` before setup-node.

17.2. [CREATE] GitHub Actions workflow — EAS build on merge to main
      → Input    : EAS_TOKEN secret in GitHub repository secrets
      → Output   : .github/workflows/eas-build.yml
      → Tool/Cmd : Add `EXPO_TOKEN` to GitHub repo secrets:
                   GitHub → Settings → Secrets → New → Name: EXPO_TOKEN
                   Value: Generate at https://expo.dev/accounts/{{EAS_ACCOUNT}}/settings/access-tokens
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
                         - uses: actions/setup-node@v4
                           with:
                             node-version: '20'
                         - uses: expo/expo-github-action@v8
                           with:
                             eas-version: latest
                             token: ${{ secrets.EXPO_TOKEN }}
                         - run: npm ci
                         - run: eas build --profile production --platform all --non-interactive
                   ```
      → Fail Mode: EAS build queue timeout in free tier — EAS free tier has limited
                   concurrent builds; production builds may queue. Upgrade EAS plan
                   or schedule builds off-peak.

17.3. [CREATE] GitHub Actions workflow — EAS submit after successful production build
      → Input    : Completed production EAS build
      → Output   : .github/workflows/eas-submit.yml
      → Tool/Cmd : Create `.github/workflows/eas-submit.yml` triggered manually or
                   after eas-build.yml succeeds:
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
                             eas-version: latest
                             token: ${{ secrets.EXPO_TOKEN }}
                         - run: eas submit --platform all --non-interactive --latest
                   ```
      → Fail Mode: Google Play submission fails — service account JSON must be available
                   as EAS secret, not committed to repo.

17.4. [CONFIGURE] Branch strategy and environment mapping
      → Input    : Git branching model
      → Output   : Documented branch → environment → EAS profile mapping
      → Tool/Cmd : Document in README.md:
                   `feature/*` → PR → CI only (tests + lint + typecheck)
                   `develop`   → merge → EAS preview build (internal QA distribution)
                   `main`      → merge → EAS production build + store submission
      → Fail Mode: Incorrect branch protection rules allow direct pushes to main —
                   enable branch protection in GitHub: require PR + CI pass before merge.

17.5. [VERIFY] Push a test PR and confirm CI pipeline passes
      → Input    : A feature branch with passing tests
      → Output   : GitHub Actions CI job passes green
      → Tool/Cmd : `git checkout -b test/ci-verification`
                   Make a trivial change, push, open PR.
                   Monitor Actions tab in GitHub.
      → Fail Mode: Action fails on typecheck — fix TS errors before proceeding;
                   do NOT add `// @ts-ignore` as a fix.

17.6. [COMMIT] Commit CI/CD configuration
      → Input    : .github/workflows/*.yml
      → Output   : Git commit
      → Tool/Cmd : `git add .github/ && git commit -m "ci: GitHub Actions + EAS build and submit workflows"`
      → Fail Mode: None beyond standard git issues.
```

**Postcondition:** CI runs on every PR (lint, typecheck, tests). EAS production build triggers on merge to main. EAS submission triggers after successful production build. Branch protection enforced.

**Feedback Gate:** BACK → PHASE 16 if EAS build fails in CI, indicating build configuration errors.

---

## PHASE 18: Pre-release QA & Beta Distribution

**Goal:** Distribute beta builds to internal testers via TestFlight (iOS) and Google Play Internal Testing, collect structured feedback, and resolve blocking issues before public release.

**Precondition:** Phase 17 complete. Production EAS build successful. App store accounts set up.

---

```
18.1. [CONFIGURE] Apple Developer — create App Store Connect app record
      → Input    : Apple Developer account with paid membership ($99/year)
      → Output   : App record in App Store Connect with {{BUNDLE_ID_IOS}}
      → Tool/Cmd : https://appstoreconnect.apple.com → Apps → + → New App
                   Bundle ID: {{BUNDLE_ID_IOS}} (must match eas.json exactly)
                   Name: {{APP_NAME}}
                   Primary Language: {{APP_LANGUAGE}}
                   SKU: {{APP_SKU: unique internal identifier}}
      → Fail Mode: Bundle ID already taken — change in Phase 2.3 and rebuild;
                   cannot be changed after submission.

18.2. [DISTRIBUTE] Submit iOS build to TestFlight via EAS
      → Input    : Successful production iOS build from EAS
      → Output   : Build available in TestFlight for internal testers
      → Tool/Cmd : `eas submit --platform ios --latest`
                   OR triggered automatically via Phase 17.3 workflow.
                   In App Store Connect → TestFlight → Internal Testing → Add build.
      → Fail Mode: Export compliance question — select "No" for encryption unless app
                   uses custom cryptography beyond standard HTTPS.

18.3. [CONFIGURE] Google Play — create app in Play Console
      → Input    : Google Play Developer account ($25 one-time fee)
      → Output   : App created in Play Console with {{PACKAGE_NAME_ANDROID}}
      → Tool/Cmd : https://play.google.com/console → Create App
                   App name: {{APP_NAME}}
                   Default language: {{APP_LANGUAGE}}
                   App/Game: App
                   Free/Paid: {{MONETIZATION_MODEL}}
      → Fail Mode: Package name already taken by another app — change in Phase 2.3
                   and rebuild; cannot be changed after submission.

18.4. [DISTRIBUTE] Submit Android build to Play Console Internal Testing
      → Input    : Successful production AAB from EAS
      → Output   : Build available in Internal Testing track
      → Tool/Cmd : `eas submit --platform android --latest`
                   OR triggered via Phase 17.3 workflow.
                   In Play Console → Testing → Internal Testing → Create release.
      → Fail Mode: Service account missing permissions — service account must have
                   "Release Manager" role in Play Console Users & Permissions.

18.5. [TEST] Structured beta QA checklist
      → Input    : Beta build on TestFlight / Internal Testing
      → Output   : QA report with severity-classified bug list
      → Tool/Cmd : Test the following systematically on physical devices:
                   AUTH: Register, Login, Session persistence, Password reset
                   CORE FLOW: All primary user journeys end-to-end
                   OFFLINE: Airplane mode — cached data shows, graceful error on mutation
                   PERFORMANCE: Cold start < 3s, scroll at 60fps, no ANR on Android
                   ACCESSIBILITY: TalkBack on Android, VoiceOver on iOS (requires iOS device)
                   EDGE CASES: Empty states, error states, network timeout handling
                   DEEP LINKS: {{APP_SCHEME}}:// URLs open correct screen
      → Fail Mode: Blocking bug found — fix and trigger new EAS build via push to main.
                   BACK → PHASE 16 if build config change is needed.

18.6. [RESOLVE] Fix all P1 (crash) and P2 (broken core flow) bugs before release
      → Input    : QA bug report
      → Output   : Updated build with zero P1/P2 bugs
      → Tool/Cmd : For each bug: create branch, fix, PR, pass CI, merge to main → new EAS build.
                   Increment version in app.json: `"version": "1.0.1"` (or as appropriate)
                   Increment build numbers: `"buildNumber"` (iOS) and `"versionCode"` (Android)
      → Fail Mode: Build number not incremented — App Store and Play Store reject
                   re-submissions with identical build numbers.

18.7. [COMMIT] Tag release candidate
      → Input    : Main branch with all P1/P2 fixes merged
      → Output   : Git tag marking release candidate
      → Tool/Cmd : `git tag -a v1.0.0 -m "Release candidate 1.0.0"`
                   `git push origin v1.0.0`
      → Fail Mode: Tag on wrong commit — `git tag -d v1.0.0` to delete and re-tag.
```

**Postcondition:** Beta builds distributed to TestFlight and Play Internal Testing. QA complete with zero P1/P2 bugs. Release candidate tagged.

**Feedback Gate:** BACK → PHASE 16 if beta testing reveals a build configuration issue; BACK → PHASE 8/9/10 for feature-level bugs.

---

## PHASE 19: App Store Submission

**Goal:** Submit the production build to both the iOS App Store and Google Play for public release, completing all metadata, screenshots, and review compliance requirements.

**Precondition:** Phase 18 complete. Zero P1/P2 bugs. All store developer accounts set up.

---

```
19.1. [PREPARE] Produce App Store screenshots (iOS)
      → Input    : Final app on physical iOS device or simulator
      → Output   : Screenshots for all required device sizes
      → Tool/Cmd : Required sizes (as of 2025):
                   6.9" (iPhone 16 Pro Max): 1320×2868
                   6.7" (iPhone 16 Plus):    1290×2796
                   6.5" (iPhone 11 Pro Max): 1242×2688
                   Use Fastlane Snapshot (requires macOS) OR capture manually on
                   physical device OR use EAS Screenshot service.
                   LINUX NOTE: Use Figma/design tool to create framed screenshots from
                   actual device photos if Simulator is unavailable.
      → Fail Mode: Wrong dimensions rejected by App Store Connect — use exact pixel
                   dimensions from Apple's required screenshot sizes page.

19.2. [PREPARE] Produce Play Store screenshots and graphics (Android)
      → Input    : Final app on physical Android device
      → Output   : Screenshots, feature graphic (1024×500), icon (512×512)
      → Tool/Cmd : Use Android's built-in screenshot tool or ADB:
                   `adb shell screencap -p /sdcard/screen.png && adb pull /sdcard/screen.png`
                   Feature graphic: Create 1024×500 PNG (required for Play Store listing).
                   Icon: 512×512 PNG with no transparency.
      → Fail Mode: Play Store rejects screenshots with device frames that include logos
                   of other platforms — use neutral device frames only.

19.3. [PREPARE] Write App Store / Play Store listing copy
      → Input    : App description, keywords
      → Output   : App name (30 chars iOS / 50 chars Android), subtitle, description, keywords
      → Tool/Cmd : Document in a `store-listing.md` file:
                   Name, Subtitle (iOS), Short description (Android), Full description,
                   Keywords (iOS: 100 chars), Category, Age rating, Support URL, Privacy Policy URL.
                   Privacy Policy URL is MANDATORY for both stores.
      → Fail Mode: Privacy policy URL is dead or returns 404 — Apple and Google both
                   actively check; rejection is automatic.

19.4. [CONFIGURE] App Store Connect — complete all metadata
      → Input    : store-listing.md, screenshots
      → Output   : All App Store Connect fields complete and saved
      → Tool/Cmd : https://appstoreconnect.apple.com → Your App → App Store tab
                   Fill: App Information, Pricing, App Review Information,
                   Version Information, Screenshots, App Privacy (Data practices questionnaire).
                   The Data practices questionnaire is mandatory and legally binding.
      → Fail Mode: Missing App Privacy data — review what data Supabase collects
                   (email, auth tokens) and disclose accurately. Misrepresentation is
                   grounds for removal.

19.5. [CONFIGURE] Play Console — complete all metadata and policies
      → Input    : store-listing.md, screenshots, feature graphic
      → Output   : Play Console listing complete; all policy declarations done
      → Tool/Cmd : Play Console → Your App → Store presence → Main store listing
                   Fill: Short description, Full description, Screenshots, Feature graphic, Icon.
                   Also complete: App content → Target audience, Data safety form,
                   Ads declaration, Content rating questionnaire.
                   Data safety form maps to Supabase data collection — email, auth.
      → Fail Mode: Data safety form incomplete — Play will block release until complete.

19.6. [SUBMIT] Submit iOS build for App Store Review
      → Input    : Production build in TestFlight, all metadata complete
      → Output   : Build submitted to Apple for review
      → Tool/Cmd : App Store Connect → Your App → App Store → + Version or Platform
                   Select the TestFlight build to submit.
                   "Submit for Review" → Answer export compliance questions.
                   Review time: typically 24–48 hours (first submission may be longer).
      → Fail Mode: Rejected by Apple — read rejection reason carefully in Resolution Center.
                   Common rejections: missing privacy policy, placeholder content, crashes
                   on review device. Respond via Resolution Center or fix and resubmit.

19.7. [SUBMIT] Submit Android build for Google Play Review
      → Input    : AAB in Internal Testing track, all metadata complete
      → Output   : Build promoted to Production track and under review
      → Tool/Cmd : Play Console → Testing → Internal Testing → Promote to Production
                   Set rollout percentage: start at 10–20% (staged rollout recommended)
                   "Send for review"
                   Review time: typically a few hours to 3 days for new apps.
      → Fail Mode: Policy violation rejection — read Play Console email carefully.
                   Common: privacy policy missing, misleading metadata, permissions
                   not justified. Fix and resubmit.

19.8. [MONITOR] Track review status until approved
      → Input    : App Store Connect and Play Console dashboards
      → Output   : Both platforms approved and live
      → Tool/Cmd : App Store Connect: App → Activity tab
                   Play Console: Release overview → Production
                   Check daily. Apple sends email on status change.
      → Fail Mode: Extended review (>7 days) — contact Apple/Google support via
                   their respective developer support channels.
```

**Postcondition:** App submitted to both stores. Metadata, screenshots, privacy policy, and data declarations complete. Under review.

**Feedback Gate:** BACK → PHASE 18 if either store review reveals a bug requiring a new build; increment version and build number before resubmission.

---

## PHASE 20: Post-deployment Monitoring & Maintenance

**Goal:** Establish ongoing crash monitoring, performance tracking, OTA update delivery, and a structured release cadence post-launch.

**Precondition:** Phase 19 complete. App live on both stores.

---

```
20.1. [INSTALL] Integrate Sentry for crash reporting
      → Input    : Sentry account (sentry.io — free tier available)
      → Output   : Crash reports from production users in Sentry dashboard
      → Tool/Cmd : `npx expo install sentry-expo`
                   `pnpm add @sentry/react-native`
                   Add to app.json:
                   ```json
                   "plugins": [["sentry-expo", { "organization": "{{SENTRY_ORG}}", "project": "{{SENTRY_PROJECT}}" }]]
                   ```
                   Initialize in _layout.tsx:
                   ```ts
                   import * as Sentry from 'sentry-expo';
                   Sentry.init({ dsn: '{{SENTRY_DSN}}', enableInExpoDevelopment: false });
                   ```
                   Add SENTRY_DSN to EAS secrets (Phase 5.4 pattern).
      → Fail Mode: Source maps not uploaded — Sentry shows minified stack traces.
                   Fix: add `postPublish` hook in app.json or upload via EAS Build hook.

20.2. [CONFIGURE] Configure alerting thresholds in Sentry
      → Input    : Sentry project
      → Output   : Alerts on crash rate >1% and new issue spikes
      → Tool/Cmd : Sentry → Alerts → Create Alert Rule:
                   Rule 1: "Crash free sessions < 99%" → notify via email/Slack.
                   Rule 2: "New issue" with >10 events in 1 hour → immediate notification.
      → Fail Mode: Alert not firing — verify Sentry SDK is initialized before first
                   render and that DSN is correctly injected in production build.

20.3. [CONFIGURE] Expo OTA Updates (EAS Update) for JS-only hotfixes
      → Input    : EAS account, production app installed on devices
      → Output   : Ability to push JS fixes without App Store review
      → Tool/Cmd : `npx expo install expo-updates`
                   `eas update:configure`
                   To push a hotfix: `eas update --branch production --message "fix: critical bug"`
                   App checks for updates on launch by default.
                   SCOPE: OTA updates can only change JavaScript/assets — NOT native code.
                   Any native dependency change requires a full EAS build + store submission.
      → Fail Mode: OTA update fails silently — check EAS Update dashboard for delivery status.
                   Update too large (>50MB) — split into smaller incremental updates.

20.4. [ESTABLISH] Define release cadence and version strategy
      → Input    : Project roadmap
      → Output   : Documented release process in CONTRIBUTING.md
      → Tool/Cmd : Document in CONTRIBUTING.md:
                   Hotfixes: OTA update (JS-only) or fast-track patch build.
                   Patch releases (x.x.N): Bug fixes — submit to stores.
                   Minor releases (x.N.0): New features — full QA cycle (Phase 18).
                   Major releases (N.0.0): Breaking changes — extended QA + phased rollout.
                   Semantic versioning enforced: bump `version` in app.json per semver.
      → Fail Mode: No documented cadence leads to ad-hoc releases and user confusion.

20.5. [MONITOR] Track app store ratings and reviews
      → Input    : Live app on both stores
      → Output   : Awareness of user-reported issues
      → Tool/Cmd : App Store Connect → Ratings & Reviews (enable email notifications).
                   Play Console → Ratings & Reviews → Reply to reviews.
                   Respond to 1–2 star reviews within 48 hours where possible.
      → Fail Mode: Negative reviews from reproducible bugs — prioritize fixing and
                   deploying patch; update response when fix ships.

20.6. [MAINTAIN] Dependency updates and security patches
      → Input    : Running production app
      → Output   : Dependencies kept current; vulnerabilities patched
      → Tool/Cmd : Monthly: `pnpm outdated` → review and test updates.
                   `pnpm audit` → immediately patch critical/high vulnerabilities.
                   Expo SDK major upgrades: follow Expo upgrade guide at
                   https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/
                   Never upgrade Expo SDK without full regression test (Phase 12).
      → Fail Mode: Skipping Expo SDK upgrades leads to deprecated API warnings
                   becoming hard blockers when Apple/Google update OS requirements.

20.7. [MAINTAIN] Supabase project health monitoring
      → Input    : Supabase dashboard
      → Output   : Database performance, quota, and error metrics monitored
      → Tool/Cmd : Supabase Dashboard → Reports → API requests, slow queries, DB size.
                   Set up Supabase database backups: Settings → Database → Backups (enabled by default on paid plans).
                   Monitor JWT expiry behavior: Supabase access tokens expire in 1 hour;
                   confirm `autoRefreshToken: true` is working in production.
      → Fail Mode: Database quota exceeded on free tier (500MB) — either optimize queries,
                   purge old data, or upgrade Supabase plan before data loss occurs.
```

**Postcondition:** Sentry crash reporting active. OTA update capability configured. Release cadence documented. App store ratings monitored. Dependency maintenance scheduled.

**Feedback Gate:** BACK → any prior phase if monitoring reveals a systemic issue (e.g., BACK → PHASE 9 for auth bugs, BACK → PHASE 13 for performance regressions, BACK → PHASE 16 for build failures affecting OTA compatibility).

---

## SUMMARY: KEY VARIABLE SLOTS REQUIRING RESOLUTION

```
{{APP_NAME}}                 — Application display name
{{APP_NAME_SLUG}}            — URL-safe lowercase slug (e.g., my-app)
{{APP_SCHEME}}               — Deep link URI scheme (e.g., myapp)
{{BUNDLE_ID_IOS}}            — iOS bundle identifier (e.g., com.company.myapp)
{{PACKAGE_NAME_ANDROID}}     — Android package name (e.g., com.company.myapp)
{{SUPABASE_URL}}             — Supabase project URL from project settings
{{SUPABASE_ANON_KEY}}        — Supabase anon/public key from project settings
{{SUPABASE_PROJECT_ID}}      — Supabase project ID (from URL)
{{EAS_ACCOUNT}}              — Expo account slug
{{REMOTE_REPO_URL}}          — Git remote origin URL
{{TABLE_NAME}}               — Supabase database table name for data hooks
{{APPLE_ID}}                 — Apple Developer account email
{{ASC_APP_ID}}               — App Store Connect numeric app ID
{{TEST_USER_EMAIL}}          — E2E test account email in Supabase Auth
{{TEST_USER_PASSWORD}}       — E2E test account password
{{SENTRY_ORG}}               — Sentry organization slug
{{SENTRY_PROJECT}}           — Sentry project name
{{SENTRY_DSN}}               — Sentry data source name URL
{{APP_LANGUAGE}}             — Primary language (e.g., en-US)
{{APP_SKU}}                  — Unique internal SKU for App Store Connect
{{MONETIZATION_MODEL}}       — Free or Paid (for Play Console)
```

---

## LINUX-SPECIFIC CONSTRAINT SUMMARY

| Concern | Linux Limitation | Resolution |
|---|---|---|
| iOS builds | No Xcode | EAS Build (cloud) — mandatory |
| iOS simulator | Not available | Physical iOS device + Expo Go |
| iOS E2E (Detox) | No iOS simulator | EAS cloud device farm or skip iOS E2E |
| Android local build | Fully supported | Android Studio + adb |
| Android emulator | RAM-constrained (12GB) | Physical Android device preferred |
| Code signing (iOS) | No Keychain | EAS Credentials management |
| Screenshots (iOS) | No Simulator | Physical device capture or design tool |
