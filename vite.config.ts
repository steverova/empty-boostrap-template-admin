import path from 'node:path'
import babel from '@rolldown/plugin-babel'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		vanillaExtractPlugin(),
		babel({ presets: [reactCompilerPreset()] }),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@components': path.resolve(__dirname, './src/components'),
			'@constants': path.resolve(__dirname, './src/constants'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@libs': path.resolve(__dirname, './src/libs'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@providers': path.resolve(__dirname, './src/providers'),
			'@router': path.resolve(__dirname, './src/router'),
			'@stores': path.resolve(__dirname, './src/stores'),
		},
	},
})
