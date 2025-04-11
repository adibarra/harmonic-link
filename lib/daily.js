import { randomInt } from "crypto";
import * as spot from "./spotify.js";
import * as logic from "./logic.js";
import dotenv from "dotenv";
import { start } from "repl";
import { createClient } from '@supabase/supabase-js'

dotenv.config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PRIVATE_SUPABASE_SERVICE_KEY)

