import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Inter', 'sans-serif'],
				'anton': ['Anton', 'sans-serif'],
				'admin-display': ['Sora', 'Inter', 'sans-serif'],
				'admin-body': ['Manrope', 'Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Neon Fidelity Color Palette
				nf: {
					background: '#050505',
					surface: '#0a0a0a',
					'surface-alt': '#111111',
					primary: '#00bcd4',
					'primary-hover': '#0097a7',
					secondary: '#16537e',
					border: '#1f2937',
					text: '#ffffff',
					'text-muted': '#9ca3af',
				},
				// Legacy palettes (kept for compatibility)
				electric: {
					50: '#f0fdff',
					100: '#ccf7fe',
					200: '#99effd',
					300: '#00bcd4',
					400: '#00bfe6',
					500: '#00a9cc',
					600: '#0087a8',
					700: '#006b85',
					800: '#005c73',
					900: '#004d5e'
				},
				ocean: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9',
					600: '#16537e',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e'
				},
				neon: {
					50: '#ecfeff',
					100: '#cffafe',
					200: '#a5f3fc',
					300: '#00bcd4',
					400: '#06b6d4',
					500: '#0891b2',
					600: '#0e7490',
					700: '#164e63',
					800: '#155e75',
					900: '#083344'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'neon': '0 0 20px rgba(0, 188, 212, 0.3)',
				'neon-hover': '0 0 30px rgba(0, 188, 212, 0.4)',
				'neon-strong': '0 0 40px rgba(0, 188, 212, 0.6)',
				'azure': '0 10px 40px -10px hsl(187 100% 42% / 0.45)',
				'azure-strong': '0 20px 60px -10px hsl(187 100% 42% / 0.6)',
				'elegant': '0 8px 30px -12px hsl(0 0% 0% / 0.6)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'glow': {
					'0%, 100%': {
						textShadow: '0 0 5px #00bcd4, 0 0 10px #00bcd4, 0 0 20px #00bcd4'
					},
					'50%': {
						textShadow: '0 0 10px #00bcd4, 0 0 20px #00bcd4, 0 0 40px #00bcd4'
					}
				},
				'liquid-flow': {
					'0%': {
						transform: 'translateX(-100%) skewX(-15deg)'
					},
					'100%': {
						transform: 'translateX(200%) skewX(-15deg)'
					}
				},
				'ripple': {
					'0%': {
						transform: 'scale(0)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(4)',
						opacity: '0'
					}
				},
				'wave': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'33%': {
						transform: 'translateY(-10px) rotate(1deg)'
					},
					'66%': {
						transform: 'translateY(5px) rotate(-1deg)'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(0, 188, 212, 0.4), 0 0 40px rgba(0, 188, 212, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 40px rgba(0, 188, 212, 0.6), 0 0 80px rgba(0, 188, 212, 0.5)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'liquid-flow': 'liquid-flow 3s ease-in-out infinite',
				'ripple': 'ripple 1s ease-out',
				'wave': 'wave 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
