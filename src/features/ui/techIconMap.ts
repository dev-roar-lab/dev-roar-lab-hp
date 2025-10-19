import { IconType } from 'react-icons'
import {
  SiAmazon,
  SiAwslambda,
  SiPython,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiDocker,
  SiNodedotjs,
  SiGithubactions,
  SiCloudflare,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiJavascript,
  SiGraphql,
  SiTailwindcss,
  SiGit,
  SiKubernetes,
  SiTerraform,
  SiClaude,
  SiAnthropic,
  SiSharp
} from 'react-icons/si'

export interface TechInfo {
  icon: IconType
  color: string
}

export const techIconMap: Record<string, TechInfo> = {
  // Cloud & Infrastructure
  AWS: { icon: SiAmazon, color: '#FF9900' },
  Lambda: { icon: SiAwslambda, color: '#FF9900' },
  'API Gateway': { icon: SiAmazon, color: '#FF9900' },
  DynamoDB: { icon: SiAmazon, color: '#FF9900' },
  CloudFormation: { icon: SiAmazon, color: '#FF9900' },

  // Languages
  Python: { icon: SiPython, color: '#3776AB' },
  TypeScript: { icon: SiTypescript, color: '#3178C6' },
  JavaScript: { icon: SiJavascript, color: '#F7DF1E' },
  'C#': { icon: SiSharp, color: '#239120' },

  // Frontend
  React: { icon: SiReact, color: '#61DAFB' },
  'Next.js': { icon: SiNextdotjs, color: '#000000' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4' },

  // Backend & Runtime
  'Node.js': { icon: SiNodedotjs, color: '#339933' },
  GraphQL: { icon: SiGraphql, color: '#E10098' },

  // Databases
  PostgreSQL: { icon: SiPostgresql, color: '#4169E1' },
  MongoDB: { icon: SiMongodb, color: '#47A248' },
  Redis: { icon: SiRedis, color: '#DC382D' },

  // DevOps & Tools
  Docker: { icon: SiDocker, color: '#2496ED' },
  Kubernetes: { icon: SiKubernetes, color: '#326CE5' },
  Terraform: { icon: SiTerraform, color: '#7B42BC' },
  'GitHub Actions': { icon: SiGithubactions, color: '#2088FF' },
  Git: { icon: SiGit, color: '#F05032' },
  Cloudflare: { icon: SiCloudflare, color: '#F38020' },

  // AI & Development Tools
  'Claude Code': { icon: SiClaude, color: '#CC9B7A' },
  Claude: { icon: SiClaude, color: '#CC9B7A' },
  Anthropic: { icon: SiAnthropic, color: '#CC9B7A' },

  // CI/CD
  'CI/CD': { icon: SiGithubactions, color: '#2088FF' }
}

// ヘルパー関数：技術名から情報を取得（フォールバック付き）
export function getTechInfo(techName: string): TechInfo | null {
  return techIconMap[techName] || null
}
