export default {
  name: 'trip',
  title: '足迹 (Trip)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '标题 (Title)',
      type: 'string',
      description: '例如：京都赏樱之旅、成都美食行',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'locationName',
      title: '地点名称 (Location Name)',
      type: 'string',
      description: '例如：Sichuan, Kyoto, Paris (用于地图精准匹配)',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'country',
      title: '国家 (Country)',
      type: 'string',
      description: '例如：China, Japan, France',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'visitDate',
      title: '游玩月份/日期 (Visit Date)',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM',
      },
    },
    {
      name: 'coverImage',
      title: '封面图片 (Cover Image)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'gallery',
      title: '相册 (Gallery)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: '上传在该地游玩时拍摄的照片',
    },
    {
      name: 'notes',
      title: '游记简述 (Notes)',
      type: 'text',
      description: '一小段回忆或文字记录',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'locationName',
      media: 'coverImage',
    },
  },
}
