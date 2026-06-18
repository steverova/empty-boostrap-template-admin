import { z } from 'zod'

const taskPriorities = ['low', 'medium', 'high'] as const
const taskStatuses = ['backlog', 'todo', 'inprogress', 'test', 'done', 'cancelled'] as const

const attachmentSchema = z.object({
	id: z.string(),
	type: z.enum(['image', 'video', 'link']),
	url: z.string(),
	name: z.string(),
})

const todoItemSchema = z.object({
	id: z.string(),
	text: z.string().min(1, 'Todo text is required'),
	description: z.string().optional().default(''),
	completed: z.boolean(),
	attachments: z.array(attachmentSchema).optional().default([]),
})

export const taskSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	priority: z.enum(taskPriorities, { required_error: 'Priority is required' }),
	status: z.enum(taskStatuses, { required_error: 'Status is required' }),
	assignee: z.string().optional(),
	dueDate: z.string().optional(),
	project: z.string().optional(),
	members: z.array(z.string()).optional(),
	todos: z.array(todoItemSchema).optional().default([]),
})

export type TaskFormData = z.infer<typeof taskSchema>
