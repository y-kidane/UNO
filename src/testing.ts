import { is_null, head, list, tail, List, pair, append } from "../lib/list";
import { Card, Color, Value, Card_info, Hand } from "./types";
import { Queue, empty as empty_q, is_empty as is_empty_q,
    enqueue, dequeue, head as q_head, display_queue } from "../lib/queue_array";
import { pop, top, Stack, NonEmptyStack, empty as empty_s,
    is_empty as is_empty_s, push,  } from "../lib/stack";
