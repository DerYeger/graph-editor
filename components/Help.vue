<template>
  <v-dialog v-model="dialog">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" icon v-on="on">
        <v-icon v-text="'mdi-help'" />
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Controls</v-card-title>
      <v-data-table :headers="headers" :items="controls" hide-default-footer />
      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
interface Control {
  action: string
  desktop: string
  mobile: string
}

export default {
  data(): { controls: Control[]; dialog: Boolean; headers: any[] } {
    return {
      controls: [
        {
          action: 'Pan',
          desktop: 'Left-click',
          mobile: 'Multi-touch',
        },
        {
          action: 'Zoom',
          desktop: 'Mouse wheel',
          mobile: 'Multi-touch',
        },
        {
          action: 'Move node',
          desktop: 'Middle click',
          mobile: '-',
        },
        {
          action: 'Create node',
          desktop: 'Double-click',
          mobile: 'Double-tap',
        },
        {
          action: 'Create link',
          desktop: 'Left-click & drag',
          mobile: 'Touch & drag',
        },
        {
          action: 'Delete node/link',
          desktop: 'Right-click',
          mobile: 'Long tap',
        },
      ],
      dialog: false,
      headers: [
        {
          text: 'Action',
          value: 'action',
          sortable: false,
        },
        {
          text: 'Desktop',
          value: 'desktop',
          sortable: false,
        },
        {
          text: 'Mobile',
          value: 'mobile',
          sortable: false,
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.v-data-table-header-mobile {
  tr:first-child {
    th {
      height: 0 !important;
    }
  }
}
</style>
